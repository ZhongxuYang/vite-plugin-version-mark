/**
 * 结果格式化器测试
 */

import {describe, it, expect} from 'vitest'
import {
  ResultFormatter,
  FormatError,
} from '../src/plugins/core/formatter'
import type {CommandResult} from '../src/plugins/types'

describe('ResultFormatter', () => {
  const formatter = new ResultFormatter()

  // 创建测试用的命令结果
  const createResults = (): Map<string, CommandResult> => {
    const results = new Map<string, CommandResult>()

    results.set('branch', {
      alias: 'branch',
      command: 'git branch --show-current',
      result: 'main',
      duration: 100,
      success: true,
    })

    results.set('sha', {
      alias: 'sha',
      command: 'git rev-parse --short HEAD',
      result: 'abc1234',
      duration: 80,
      success: true,
    })

    results.set('tag', {
      alias: 'tag',
      command: 'git describe --tags',
      result: 'v1.0.0',
      duration: 120,
      success: true,
    })

    return results
  }

  const createNumericResults = (): Map<string, CommandResult> => {
    const results = new Map<string, CommandResult>()

    results.set('0', {
      alias: '0',
      command: 'git branch --show-current',
      result: 'main',
      duration: 100,
      success: true,
    })

    results.set('1', {
      alias: '1',
      command: 'git rev-parse --short HEAD',
      result: 'abc1234',
      duration: 80,
      success: true,
    })

    return results
  }

  // 模板解析和验证功能通过 format 方法的行为来测试

  describe('format', () => {
    it('should format with template', () => {
      const results = createResults()
      const template = '{branch}-{sha}'

      const formatted = formatter.format(results, template)

      expect(formatted).toBe('main-abc1234')
    })

    it('should format with complex template', () => {
      const results = createResults()
      const template = 'Version: {tag} ({branch}-{sha})'

      const formatted = formatter.format(results, template)

      expect(formatted).toBe('Version: v1.0.0 (main-abc1234)')
    })

    it('should format with default separator when no template', () => {
      const results = createNumericResults()

      const formatted = formatter.format(results)

      expect(formatted).toBe('main-abc1234')
    })

    it('should format with custom separator', () => {
      const results = createNumericResults()

      const formatted = formatter.format(results, undefined, '_')

      expect(formatted).toBe('main_abc1234')
    })

    it('should handle empty results', () => {
      const results = new Map<string, CommandResult>()

      const formatted = formatter.format(results, '{branch}-{sha}')

      expect(formatted).toBe('')
    })

    it('should throw error for invalid template', () => {
      const results = createResults()
      const template = '{branch}-{missing}'

      expect(() => {
        formatter.format(results, template)
      }).toThrow(FormatError)
    })

    it('should handle failed commands in template', () => {
      const results = new Map<string, CommandResult>()

      results.set('success', {
        alias: 'success',
        command: 'echo hello',
        result: 'hello',
        duration: 50,
        success: true,
      })

      results.set('failure', {
        alias: 'failure',
        command: 'invalid-command',
        error: new Error('Command failed'),
        duration: 30,
        success: false,
      })

      const formatted = formatter.format(results, '{success}-{failure}')

      expect(formatted).toBe('hello-')
    })

    it('should handle failed commands with fallback values', () => {
      const results = new Map<string, CommandResult>()

      results.set('success', {
        alias: 'success',
        command: 'echo hello',
        result: 'hello',
        duration: 50,
        success: true,
      })

      results.set('fallback', {
        alias: 'fallback',
        command: 'invalid-command',
        result: 'default-value',
        error: new Error('Command failed'),
        duration: 30,
        success: false,
      })

      const formatted = formatter.format(results, '{success}-{fallback}')

      expect(formatted).toBe('hello-default-value')
    })

    it('should follow Map insertion order for numeric aliases', () => {
      const results = new Map<string, CommandResult>()

      // 添加顺序：10, 2, 1
      results.set('10', {
        alias: '10',
        command: 'echo third',
        result: 'third',
        duration: 50,
        success: true,
      })

      results.set('2', {
        alias: '2',
        command: 'echo second',
        result: 'second',
        duration: 50,
        success: true,
      })

      results.set('1', {
        alias: '1',
        command: 'echo first',
        result: 'first',
        duration: 50,
        success: true,
      })

      const formatted = formatter.format(results)

      // 应该按照 Map 的插入顺序：10, 2, 1
      expect(formatted).toBe('third-second-first')
    })

    it('should maintain Map insertion order for string aliases', () => {
      const results = new Map<string, CommandResult>()

      // 按照插入顺序：zebra, alpha, beta
      results.set('zebra', {
        alias: 'zebra',
        command: 'echo zebra',
        result: 'zebra',
        duration: 50,
        success: true,
      })

      results.set('alpha', {
        alias: 'alpha',
        command: 'echo alpha',
        result: 'alpha',
        duration: 50,
        success: true,
      })

      results.set('beta', {
        alias: 'beta',
        command: 'echo beta',
        result: 'beta',
        duration: 50,
        success: true,
      })

      const formatted = formatter.format(results)

      // 应该保持 Map 的插入顺序，而不是字母顺序
      expect(formatted).toBe('zebra-alpha-beta')
    })
  })

  describe('edge cases', () => {
    it('should handle template with special characters', () => {
      const results = new Map<string, CommandResult>()
      results.set('special', {
        alias: 'special',
        command: 'echo test',
        result: 'test-value',
        duration: 50,
        success: true,
      })

      const formatted = formatter.format(results, 'Version: {special} (build)')
      expect(formatted).toBe('Version: test-value (build)')
    })

    it('should handle empty string results', () => {
      const results = new Map<string, CommandResult>()
      results.set('empty', {
        alias: 'empty',
        command: 'echo',
        result: '',
        duration: 50,
        success: true,
      })

      const formatted = formatter.format(results, 'Value: \'{empty}\'')
      expect(formatted).toBe('Value: \'\'')
    })

    it('should handle results with null/undefined values', () => {
      const results = new Map<string, CommandResult>()
      results.set('null', {
        alias: 'null',
        command: 'echo',
        result: undefined,
        duration: 50,
        success: true,
      })

      const formatted = formatter.format(results, 'Value: {null}')
      expect(formatted).toBe('Value: ')
    })

    it('should handle template with no placeholders', () => {
      const results = createResults()
      const template = 'Static text without placeholders'

      const formatted = formatter.format(results, template)
      expect(formatted).toBe('Static text without placeholders')
    })

    it('should handle multiple same placeholders in template', () => {
      const results = createResults()
      const template = '{branch}-{branch}-{sha}'

      const formatted = formatter.format(results, template)
      expect(formatted).toBe('main-main-abc1234')
    })

    it('should skip results without values in separator mode', () => {
      const results = new Map<string, CommandResult>()
      
      results.set('valid', {
        alias: 'valid',
        command: 'echo hello',
        result: 'hello',
        duration: 50,
        success: true,
      })

      results.set('empty', {
        alias: 'empty',
        command: 'echo',
        result: '',
        duration: 50,
        success: true,
      })

      results.set('null', {
        alias: 'null',
        command: 'echo',
        result: undefined,
        duration: 50,
        success: false,
      })

      const formatted = formatter.format(results)
      expect(formatted).toBe('hello') // only includes valid result
    })
  })

  // 统计信息和模板转义功能已移除，因为它们在实际使用中不需要
})
