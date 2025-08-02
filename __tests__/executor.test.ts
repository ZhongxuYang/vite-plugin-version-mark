/**
 * 命令执行器测试
 */

import {describe, it, expect, vi, beforeEach} from 'vitest'
import {
  CommandExecutor,
  CommandExecutionError,
} from '../src/plugins/core/executor'
import type {CommandConfig} from '../src/plugins/types'

// Mock child_process
vi.mock('child_process', () => ({
  default: {
    exec: vi.fn(),
  },
}))

// Define proper types for mocked functions
type ExecCallback = (
  error: Error | null,
  stdout: string | null,
  stderr?: string
) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockExec = any

describe('CommandExecutor', () => {
  let executor: CommandExecutor
  let mockExec: MockExec

  beforeEach(async () => {
    executor = new CommandExecutor()
    const childProcess = await import('child_process')
    mockExec = childProcess.default.exec as MockExec
    mockExec.mockClear()
  })

  describe('execSingleCommand', () => {
    it('should execute command successfully', async () => {
      const command = 'echo hello'
      const expectedOutput = 'hello'

      // Mock successful execution
      mockExec.mockImplementation((_cmd: string, callback: ExecCallback) => {
        callback(null, expectedOutput + '\n')
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await executor.execSingleCommand(command)
      expect(result).toBe(expectedOutput)
      expect(mockExec).toHaveBeenCalledWith(command, expect.any(Function))
    })

    it('should handle command execution error', async () => {
      const command = 'invalid-command'
      const error = new Error('Command not found')

      mockExec.mockImplementation((_cmd: string, callback: ExecCallback) => {
        callback(error, null)
        return {on: vi.fn(), kill: vi.fn()}
      })

      await expect(executor.execSingleCommand(command)).rejects.toThrow(
        CommandExecutionError,
      )
    })

    it('should handle command timeout', async () => {
      const command = 'sleep 10'
      const timeout = 100

      const mockChild = {
        on: vi.fn(),
        kill: vi.fn(),
      }

      mockExec.mockImplementation(() => {
        // 不调用 callback，模拟命令挂起
        return mockChild
      })

      await expect(
        executor.execSingleCommand(command, timeout),
      ).rejects.toThrow(CommandExecutionError)

      // 验证超时后调用了 kill
      expect(mockChild.kill).toHaveBeenCalled()
    })

    it('should clean up timeout on command completion', async () => {
      const command = 'echo test'
      const mockChild = {
        on: vi.fn(),
        kill: vi.fn(),
      }

      mockExec.mockImplementation((_cmd: string, callback: ExecCallback) => {
        // 立即完成命令
        setTimeout(() => callback(null, 'test\n'), 10)
        return mockChild
      })

      await executor.execSingleCommand(command)

      // 验证注册了 exit 事件监听器
      expect(mockChild.on).toHaveBeenCalledWith('exit', expect.any(Function))
    })
  })

  describe('execMultipleCommands', () => {
    const createMockCommands = (): CommandConfig[] => [
      {alias: 'cmd1', cmd: 'echo hello', timeout: 5000},
      {alias: 'cmd2', cmd: 'echo world', timeout: 5000},
    ]

    it('should execute multiple commands in parallel', async () => {
      const commands = createMockCommands()

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        const output = cmd.includes('hello') ? 'hello' : 'world'
        setTimeout(() => callback(null, output + '\n'), 10)
        return {on: vi.fn(), kill: vi.fn()}
      })

      const results = await executor.execMultipleCommands(commands, {
        parallel: true,
      })

      expect(results.size).toBe(2)
      expect(results.get('cmd1')?.result).toBe('hello')
      expect(results.get('cmd1')?.success).toBe(true)
      expect(results.get('cmd2')?.result).toBe('world')
      expect(results.get('cmd2')?.success).toBe(true)
    })

    it('should execute multiple commands in series', async () => {
      const commands = createMockCommands()
      const executionOrder: string[] = []

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        executionOrder.push(cmd)
        const output = cmd.includes('hello') ? 'hello' : 'world'
        setTimeout(() => callback(null, output + '\n'), 10)
        return {on: vi.fn(), kill: vi.fn()}
      })

      const results = await executor.execMultipleCommands(commands, {
        parallel: false,
      })

      expect(results.size).toBe(2)
      expect(executionOrder).toEqual(['echo hello', 'echo world'])
    })

    it('should handle errors with skip strategy', async () => {
      const commands: CommandConfig[] = [
        {alias: 'success', cmd: 'echo hello', timeout: 5000},
        {alias: 'failure', cmd: 'invalid-command', timeout: 5000},
      ]

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('invalid')) {
          callback(new Error('Command not found'), null)
        } else {
          callback(null, 'hello\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const results = await executor.execMultipleCommands(commands, {
        errorStrategy: 'skip',
      })

      expect(results.size).toBe(2)
      expect(results.get('success')?.success).toBe(true)
      expect(results.get('failure')?.success).toBe(false)

      expect(results.get('failure')?.result).toBe('')
    })

    it('should handle errors with fallback strategy', async () => {
      const commands: CommandConfig[] = [
        {alias: 'success', cmd: 'echo hello', timeout: 5000},
        {
          alias: 'failure',
          cmd: 'invalid-command',
          fallback: 'default-value',
          timeout: 5000,
        },
      ]

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('invalid')) {
          callback(new Error('Command not found'), null)
        } else {
          callback(null, 'hello\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const results = await executor.execMultipleCommands(commands, {
        errorStrategy: 'fallback',
      })

      expect(results.size).toBe(2)
      expect(results.get('success')?.success).toBe(true)
      expect(results.get('failure')?.success).toBe(true)
      expect(results.get('failure')?.result).toBe('default-value')
    })

    it('should handle fallback strategy without fallback value', async () => {
      const commands: CommandConfig[] = [
        {alias: 'success', cmd: 'echo hello', timeout: 5000},
        {alias: 'failure', cmd: 'invalid-command', timeout: 5000}, // no fallback
      ]

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('invalid')) {
          callback(new Error('Command not found'), null)
        } else {
          callback(null, 'hello\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const results = await executor.execMultipleCommands(commands, {
        errorStrategy: 'fallback',
      })

      expect(results.size).toBe(2)
      expect(results.get('success')?.success).toBe(true)
      expect(results.get('failure')?.success).toBe(false)
      expect(results.get('failure')?.result).toBe('')
    })

    it('should handle empty commands array', async () => {
      const commands: CommandConfig[] = []

      const results = await executor.execMultipleCommands(commands)

      expect(results.size).toBe(0)
    })

    it('should use default timeout when not specified', async () => {
      const command = 'echo test'

      mockExec.mockImplementation((_cmd: string, callback: ExecCallback) => {
        callback(null, 'test\n')
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await executor.execSingleCommand(command)
      expect(result).toBe('test')
    })

    it('should handle errors with strict strategy', async () => {
      const commands: CommandConfig[] = [
        {alias: 'success', cmd: 'echo hello', timeout: 5000},
        {alias: 'failure', cmd: 'invalid-command', timeout: 5000},
      ]

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('invalid')) {
          callback(new Error('Command not found'), null)
        } else {
          callback(null, 'hello\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      await expect(
        executor.execMultipleCommands(commands, {
          errorStrategy: 'strict',
          parallel: false,
        }),
      ).rejects.toThrow(CommandExecutionError)
    })

    it('should handle strict strategy with parallel execution', async () => {
      const commands: CommandConfig[] = [
        {alias: 'success', cmd: 'echo hello', timeout: 5000},
        {alias: 'failure', cmd: 'invalid-command', timeout: 5000},
      ]

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('invalid')) {
          setTimeout(() => callback(new Error('Command not found'), null), 10)
        } else {
          setTimeout(() => callback(null, 'hello\n'), 10)
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      await expect(
        executor.execMultipleCommands(commands, {
          errorStrategy: 'strict',
          parallel: true,
        }),
      ).rejects.toThrow(CommandExecutionError)
    })
  })

  // 统计信息功能已移除，因为在实际使用中不需要
})
