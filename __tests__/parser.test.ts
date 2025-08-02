/**
 * 配置解析器测试
 */

import {describe, it, expect} from 'vitest'
import {ConfigurationParser, ConfigValidationError} from '../src/plugins/core/parser'
import type {MultiCommandOptions} from '../src/plugins/types'

describe('ConfigurationParser', () => {
  const parser = new ConfigurationParser()

  describe('parseCommandConfig', () => {
    it('should handle undefined command', () => {
      const result = parser.parseCommandConfig(undefined)
      
      expect(result.isSingle).toBe(true)
      expect(result.commands).toEqual([])
      expect(result.options.commands).toEqual([])
      expect(result.options.separator).toBe('-')
      expect(result.options.errorStrategy).toBe('skip')
      expect(result.options.parallel).toBe(true)
    })

    it('should parse string command (backward compatibility)', () => {
      const command = 'git describe --tags'
      const result = parser.parseCommandConfig(command)
      
      expect(result.isSingle).toBe(true)
      expect(result.commands).toHaveLength(1)
      expect(result.commands[0]).toEqual({
        alias: '0',
        cmd: command,
        timeout: 10000,
      })
      expect(result.options.commands).toEqual([command])
    })

    it('should parse simple multi-command array', () => {
      const config: MultiCommandOptions = {
        commands: ['git branch --show-current', 'git rev-parse --short HEAD'],
      }
      
      const result = parser.parseCommandConfig(config)
      
      expect(result.isSingle).toBe(false)
      expect(result.commands).toHaveLength(2)
      expect(result.commands[0]).toEqual({
        alias: '0',
        cmd: 'git branch --show-current',
        timeout: 10000,
      })
      expect(result.commands[1]).toEqual({
        alias: '1',
        cmd: 'git rev-parse --short HEAD',
        timeout: 10000,
      })
    })

    it('should parse complex multi-command configuration', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'branch', cmd: 'git branch --show-current', fallback: 'main'},
          {alias: 'sha', cmd: 'git rev-parse --short HEAD', timeout: 5000},
        ],
        format: '{branch}-{sha}',
        separator: '_',
        errorStrategy: 'fallback',
        parallel: false,
      }
      
      const result = parser.parseCommandConfig(config)
      
      expect(result.isSingle).toBe(false)
      expect(result.commands).toHaveLength(2)
      expect(result.commands[0]).toEqual({
        alias: 'branch',
        cmd: 'git branch --show-current',
        fallback: 'main',
        timeout: 10000,
      })
      expect(result.commands[1]).toEqual({
        alias: 'sha',
        cmd: 'git rev-parse --short HEAD',
        timeout: 5000,
      })
      expect(result.options.format).toBe('{branch}-{sha}')
      expect(result.options.separator).toBe('_')
      expect(result.options.errorStrategy).toBe('fallback')
      expect(result.options.parallel).toBe(false)
    })

    it('should throw error for invalid command type', () => {
      expect(() => {
        parser.parseCommandConfig({} as never)
      }).toThrow(ConfigValidationError)
    })
  })

  describe('validation errors', () => {
    it('should throw error for non-array commands', () => {
      const config = {
        commands: 'not-an-array',
      } as unknown as MultiCommandOptions
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for empty commands array', () => {
      const config: MultiCommandOptions = {
        commands: [],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for invalid error strategy', () => {
      const config = {
        commands: ['git status'],
        errorStrategy: 'invalid-strategy',
      } as unknown as MultiCommandOptions
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for invalid separator type', () => {
      const config = {
        commands: ['git status'],
        separator: 123,
      } as unknown as MultiCommandOptions
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for invalid format type', () => {
      const config = {
        commands: ['git status'],
        format: 123,
      } as unknown as MultiCommandOptions
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for invalid parallel type', () => {
      const config = {
        commands: ['git status'],
        parallel: 'yes',
      } as unknown as MultiCommandOptions
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for command without alias', () => {
      const config: MultiCommandOptions = {
        commands: [
          {cmd: 'git status'} as never, // missing alias
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for command without cmd', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'test'} as never, // missing cmd
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for invalid timeout', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'test', cmd: 'git status', timeout: -1},
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should throw error for undefined placeholder in format', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'branch', cmd: 'git branch --show-current'},
        ],
        format: '{branch}-{undefined-placeholder}',
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })
  })

  describe('format template validation', () => {
    it('should validate format template with string commands', () => {
      const config: MultiCommandOptions = {
        commands: ['git branch --show-current', 'git rev-parse --short HEAD'],
        format: '{0}-{1}',
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).not.toThrow()
    })

    it('should validate format template with command objects', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'branch', cmd: 'git branch --show-current'},
          {alias: 'sha', cmd: 'git rev-parse --short HEAD'},
        ],
        format: '{branch}-{sha}',
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).not.toThrow()
    })

    it('should validate mixed format template', () => {
      const config: MultiCommandOptions = {
        commands: [
          'git branch --show-current',
          {alias: 'sha', cmd: 'git rev-parse --short HEAD'},
        ],
        format: '{0}-{sha}',
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).not.toThrow()
    })
  })

  describe('duplicate alias detection', () => {
    it('should throw error for duplicate aliases in command objects', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'test', cmd: 'git branch --show-current'},
          {alias: 'test', cmd: 'git rev-parse --short HEAD'}, // duplicate alias
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should handle mixed commands without duplicate issues', () => {
      const config: MultiCommandOptions = {
        commands: [
          'git branch --show-current', // alias will be "0"
          {alias: '1', cmd: 'git rev-parse --short HEAD'}, // different from auto-generated
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).not.toThrow()
    })

    it('should throw error for mixed commands with duplicate aliases', () => {
      const config: MultiCommandOptions = {
        commands: [
          'git branch --show-current', // alias will be "0"
          {alias: '0', cmd: 'git rev-parse --short HEAD'}, // same as auto-generated
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string command', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'empty', cmd: ''},
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should handle command with only whitespace', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'whitespace', cmd: '   '},
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).not.toThrow() // whitespace is technically valid
    })

    it('should handle zero timeout', () => {
      const config: MultiCommandOptions = {
        commands: [
          {alias: 'test', cmd: 'git status', timeout: 0},
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow(ConfigValidationError)
    })

    it('should handle invalid command object type', () => {
      const config: MultiCommandOptions = {
        commands: [
          null as never, // invalid command type
        ],
      }
      
      expect(() => {
        parser.parseCommandConfig(config)
      }).toThrow() // Will throw TypeError, not ConfigValidationError
    })
  })
})
