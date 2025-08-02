/**
 * Core module integration tests
 */

import {describe, it, expect, vi, beforeEach} from 'vitest'
import {analyticOptions} from '../src/plugins/core'
import type {VitePluginVersionMarkInput} from '../src/plugins/types'

// Mock child_process
vi.mock('child_process', () => ({
  default: {
    exec: vi.fn(),
  },
}))

type ExecCallback = (error: Error | null, stdout: string | null) => void
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockExec = any

describe('Core Module Integration', () => {
  let mockExec: MockExec

  beforeEach(async () => {
    const childProcess = await import('child_process')
    mockExec = childProcess.default.exec as MockExec
    mockExec.mockClear()
  })

  describe('Single command (backward compatibility)', () => {
    it('should handle string command', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: 'git describe --tags',
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        callback(null, 'v1.0.0\n')
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('v1.0.0')
      expect(result.printName).toBe('TEST_APP_VERSION')
      expect(result.printInfo).toBe('TEST_APP_VERSION: v1.0.0')
      expect(mockExec).toHaveBeenCalledWith('git describe --tags', expect.any(Function))
    })
  })

  describe('Multi-command support', () => {
    it('should handle simple multi-command array', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: {
          commands: [
            'git branch --show-current',
            'git rev-parse --short HEAD',
          ],
        },
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('branch')) {
          callback(null, 'main\n')
        } else if (cmd.includes('rev-parse')) {
          callback(null, 'abc1234\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('main-abc1234')
      expect(result.printName).toBe('TEST_APP_VERSION')
      expect(result.printInfo).toBe('TEST_APP_VERSION: main-abc1234')
    })

    it('should handle multi-command with custom format', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: {
          commands: [
            {alias: 'branch', cmd: 'git branch --show-current'},
            {alias: 'sha', cmd: 'git rev-parse --short HEAD'},
          ],
          format: '{branch}-{sha}',
        },
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('branch')) {
          callback(null, 'main\n')
        } else if (cmd.includes('rev-parse')) {
          callback(null, 'abc1234\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('main-abc1234')
    })

    it('should handle multi-command with custom separator', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: {
          commands: [
            'git branch --show-current',
            'git rev-parse --short HEAD',
          ],
          separator: '_',
        },
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('branch')) {
          callback(null, 'main\n')
        } else if (cmd.includes('rev-parse')) {
          callback(null, 'abc1234\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('main_abc1234')
    })

    it('should handle error strategy with fallback', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: {
          commands: [
            {alias: 'branch', cmd: 'git branch --show-current'},
            {alias: 'sha', cmd: 'invalid-command', fallback: 'unknown'},
          ],
          format: '{branch}-{sha}',
          errorStrategy: 'fallback',
        },
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('branch')) {
          callback(null, 'main\n')
        } else if (cmd.includes('invalid')) {
          callback(new Error('Command not found'), null)
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('main-unknown')
    })

    it('should handle error strategy with skip', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: {
          commands: [
            {alias: 'branch', cmd: 'git branch --show-current'},
            {alias: 'sha', cmd: 'invalid-command'},
          ],
          format: '{branch}-{sha}',
          errorStrategy: 'skip',
        },
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('branch')) {
          callback(null, 'main\n')
        } else if (cmd.includes('invalid')) {
          callback(new Error('Command not found'), null)
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('main-')
    })
  })

  describe('Fallback to existing logic', () => {
    it('should fallback to ifShortSHA when no command', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        ifShortSHA: true,
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        callback(null, 'abc1234\n')
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('abc1234')
      expect(mockExec).toHaveBeenCalledWith('git rev-parse --short HEAD', expect.any(Function))
    })

    it('should fallback to version when no command and no git options', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        version: '1.0.0',
      }

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('1.0.0')
      expect(mockExec).not.toHaveBeenCalled()
    })
  })

  describe('Priority rules', () => {
    it('should prioritize command over ifShortSHA', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: 'git describe --tags',
        ifShortSHA: true,
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('describe')) {
          callback(null, 'v1.0.0\n')
        } else if (cmd.includes('rev-parse')) {
          callback(null, 'abc1234\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('v1.0.0')
      expect(mockExec).toHaveBeenCalledWith('git describe --tags', expect.any(Function))
      expect(mockExec).not.toHaveBeenCalledWith('git rev-parse --short HEAD', expect.any(Function))
    })

    it('should prioritize multi-command over ifShortSHA', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: {
          commands: ['git branch --show-current', 'git rev-parse --short HEAD'],
        },
        ifShortSHA: true,
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('branch')) {
          callback(null, 'main\n')
        } else if (cmd.includes('rev-parse')) {
          callback(null, 'abc1234\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('main-abc1234')
      // 应该调用两个命令
      expect(mockExec).toHaveBeenCalledTimes(2)
    })

    it('should prioritize command over ifGitSHA', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        command: 'echo custom-version',
        ifGitSHA: true,
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('custom-version')) {
          callback(null, 'custom-version\n')
        } else if (cmd.includes('git rev-parse HEAD')) {
          callback(null, 'full-sha-hash\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('custom-version')
      expect(mockExec).toHaveBeenCalledWith('echo custom-version', expect.any(Function))
      expect(mockExec).not.toHaveBeenCalledWith('git rev-parse HEAD', expect.any(Function))
    })

    it('should prioritize ifShortSHA over ifGitSHA', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        ifShortSHA: true,
        ifGitSHA: true,
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        if (cmd.includes('--short')) {
          callback(null, 'abc1234\n')
        } else if (cmd.includes('git rev-parse HEAD')) {
          callback(null, 'full-sha-hash\n')
        }
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('abc1234')
      expect(mockExec).toHaveBeenCalledWith('git rev-parse --short HEAD', expect.any(Function))
      expect(mockExec).not.toHaveBeenCalledWith('git rev-parse HEAD', expect.any(Function))
    })

    it('should use ifGitSHA when no higher priority options', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        ifGitSHA: true,
      }

      mockExec.mockImplementation((cmd: string, callback: ExecCallback) => {
        callback(null, 'full-sha-hash\n')
        return {on: vi.fn(), kill: vi.fn()}
      })

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('full-sha-hash')
      expect(mockExec).toHaveBeenCalledWith('git rev-parse HEAD', expect.any(Function))
    })
  })

  describe('Environment variable handling', () => {
    it('should use npm_package_name from environment', async () => {
      const originalName = process.env.npm_package_name
      process.env.npm_package_name = 'test-package'

      const options: VitePluginVersionMarkInput = {
        version: '1.0.0',
      }

      const result = await analyticOptions(options)

      expect(result.printName).toBe('TEST_PACKAGE_VERSION')
      expect(result.printInfo).toBe('TEST_PACKAGE_VERSION: 1.0.0')

      // Restore original value
      if (originalName !== undefined) {
        process.env.npm_package_name = originalName
      } else {
        delete process.env.npm_package_name
      }
    })

    it('should use npm_package_version from environment', async () => {
      const originalVersion = process.env.npm_package_version
      process.env.npm_package_version = '2.0.0'

      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
      }

      const result = await analyticOptions(options)

      expect(result.printVersion).toBe('2.0.0')

      // Restore original value
      if (originalVersion !== undefined) {
        process.env.npm_package_version = originalVersion
      } else {
        delete process.env.npm_package_version
      }
    })
  })

  describe('printName generation', () => {
    it('should handle names with special characters', async () => {
      const options: VitePluginVersionMarkInput = {
        name: '@scope/my-package-name',
        version: '1.0.0',
      }

      const result = await analyticOptions(options)

      expect(result.printName).toBe('_SCOPE_MY_PACKAGE_NAME_VERSION')
    })

    it('should handle names with numbers', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'package123',
        version: '1.0.0',
      }

      const result = await analyticOptions(options)

      expect(result.printName).toBe('PACKAGE123_VERSION')
    })

    it('should handle empty name', async () => {
      const options: VitePluginVersionMarkInput = {
        name: '',
        version: '1.0.0',
      }

      const result = await analyticOptions(options)

      expect(result.printName).toBe('_VERSION')
    })
  })

  describe('outputFile handling', () => {
    it('should handle outputFile function returning array', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        version: '1.0.0',
        outputFile: (version) => [
          {path: 'version1.txt', content: `Version: ${version}`},
          {path: 'version2.json', content: `{"version": "${version}"}`},
        ],
      }

      const result = await analyticOptions(options)

      expect(result.fileList).toHaveLength(2)
      expect(result.fileList[0]).toEqual({
        path: 'version1.txt',
        content: 'Version: 1.0.0',
      })
      expect(result.fileList[1]).toEqual({
        path: 'version2.json',
        content: '{"version": "1.0.0"}',
      })
    })

    it('should handle outputFile function returning single object', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        version: '1.0.0',
        outputFile: (version) => ({
          path: 'single-version.txt',
          content: `Version: ${version}`,
        }),
      }

      const result = await analyticOptions(options)

      expect(result.fileList).toHaveLength(1)
      expect(result.fileList[0]).toEqual({
        path: 'single-version.txt',
        content: 'Version: 1.0.0',
      })
    })

    it('should handle outputFile as false', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        version: '1.0.0',
        outputFile: false,
      }

      const result = await analyticOptions(options)

      expect(result.fileList).toHaveLength(0)
    })
  })

  describe('Default options', () => {
    it('should use correct default values', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        version: '1.0.0',
      }

      const result = await analyticOptions(options)

      expect(result.ifMeta).toBe(true)
      expect(result.ifLog).toBe(true)
      expect(result.ifGlobal).toBe(true)
      expect(result.ifExport).toBe(false)
    })

    it('should respect provided option overrides', async () => {
      const options: VitePluginVersionMarkInput = {
        name: 'test-app',
        version: '1.0.0',
        ifMeta: false,
        ifLog: false,
        ifGlobal: false,
        ifExport: true,
      }

      const result = await analyticOptions(options)

      expect(result.ifMeta).toBe(false)
      expect(result.ifLog).toBe(false)
      expect(result.ifGlobal).toBe(false)
      expect(result.ifExport).toBe(true)
    })
  })
})
