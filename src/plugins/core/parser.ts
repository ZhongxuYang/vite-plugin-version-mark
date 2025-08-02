/**
 * Configuration parser - parses and validates user command configuration
 */

import type {
  MultiCommandOptions,
  CommandConfig,
  ErrorStrategy,
} from '../types'

// Configuration parse result
export interface ParsedCommandConfig {
  isSingle: boolean;
  commands: CommandConfig[];
  options: MultiCommandOptions;
}

// Configuration validation error
export class ConfigValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ConfigValidationError'
  }
}

export class ConfigurationParser {
  /**
   * Parse command configuration
   */
  parseCommandConfig(command: string | MultiCommandOptions | undefined): ParsedCommandConfig {
    if (!command) {
      return {
        isSingle: true,
        commands: [],
        options: {
          commands: [],
          separator: '-',
          errorStrategy: 'skip',
          parallel: true,
        },
      }
    }

    // Handle string configuration (backward compatibility)
    if (typeof command === 'string') {
      const commandConfig: CommandConfig = {
        alias: '0',
        cmd: command,
        timeout: 10000,
      }

      return {
        isSingle: true,
        commands: [commandConfig],
        options: {
          commands: [command],
          separator: '-',
          errorStrategy: 'skip',
          parallel: true,
        },
      }
    }

    // Handle multi-command object configuration
    if (typeof command === 'object' && command.commands) {
      this.validateMultiCommandOptions(command)
      
      const parsedCommands = this.parseCommands(command.commands)
      
      return {
        isSingle: false,
        commands: parsedCommands,
        options: {
          commands: command.commands,
          format: command.format,
          separator: command.separator || '-',
          errorStrategy: command.errorStrategy || 'skip',
          parallel: command.parallel !== false,
        },
      }
    }

    throw new ConfigValidationError('Invalid command configuration type')
  }



  /**
   * Parse commands list, convert strings and objects to CommandConfig
   */
  private parseCommands(commands: (string | CommandConfig)[]): CommandConfig[] {
    const parsedCommands = commands.map((cmd, index) => {
      if (typeof cmd === 'string') {
        return {
          alias: index.toString(),
          cmd: cmd,
          timeout: 10000,
        }
      }

      if (typeof cmd === 'object' && cmd.cmd) {
        this.validateCommandConfig(cmd, index)
        
        return {
          alias: cmd.alias,
          cmd: cmd.cmd,
          fallback: cmd.fallback,
          timeout: cmd.timeout || 10000,
        }
      }

      throw new ConfigValidationError(`Invalid command configuration at index ${index}`)
    })

    // Check for duplicate aliases
    this.checkDuplicateAliases(parsedCommands)
    
    return parsedCommands
  }

  /**
   * Validate multi-command options
   */
  private validateMultiCommandOptions(options: MultiCommandOptions): void {
    if (!Array.isArray(options.commands)) {
      throw new ConfigValidationError('commands must be an array', 'commands')
    }

    if (options.commands.length === 0) {
      throw new ConfigValidationError('commands array cannot be empty', 'commands')
    }

    if (options.errorStrategy && !this.isValidErrorStrategy(options.errorStrategy)) {
      throw new ConfigValidationError(
        'errorStrategy must be one of: strict, skip, fallback',
        'errorStrategy',
      )
    }

    if (options.separator !== undefined && typeof options.separator !== 'string') {
      throw new ConfigValidationError('separator must be a string', 'separator')
    }

    if (options.format !== undefined && typeof options.format !== 'string') {
      throw new ConfigValidationError('format must be a string', 'format')
    }

    if (options.parallel !== undefined && typeof options.parallel !== 'boolean') {
      throw new ConfigValidationError('parallel must be a boolean', 'parallel')
    }

    if (options.format) {
      this.validateFormatTemplate(options.format, options.commands)
    }
  }

  /**
   * Validate single command configuration
   */
  private validateCommandConfig(config: CommandConfig, index: number): void {
    if (!config.alias || typeof config.alias !== 'string') {
      throw new ConfigValidationError(`Command at index ${index} must have a valid alias`, 'alias')
    }

    if (!config.cmd || typeof config.cmd !== 'string') {
      throw new ConfigValidationError(`Command at index ${index} must have a valid cmd`, 'cmd')
    }

    if (config.fallback !== undefined && typeof config.fallback !== 'string') {
      throw new ConfigValidationError(`Command at index ${index} fallback must be a string`, 'fallback')
    }

    if (config.timeout !== undefined && (typeof config.timeout !== 'number' || config.timeout <= 0)) {
      throw new ConfigValidationError(`Command at index ${index} timeout must be a positive number`, 'timeout')
    }


  }

  /**
   * Validate format template placeholders
   */
  private validateFormatTemplate(format: string, commands: (string | CommandConfig)[]): void {
    const placeholders = this.extractPlaceholders(format)
    const availableAliases = new Set<string>()
    commands.forEach((cmd, index) => {
      if (typeof cmd === 'string') {
        availableAliases.add(index.toString())
      } else {
        availableAliases.add(cmd.alias)
      }
    })

    for (const placeholder of placeholders) {
      if (!availableAliases.has(placeholder)) {
        throw new ConfigValidationError(
          `Format template contains undefined placeholder: {${placeholder}}`,
          'format',
        )
      }
    }
  }

  /**
   * Extract placeholders from format template
   */
  private extractPlaceholders(format: string): string[] {
    const regex = /\{([^}]+)\}/g
    const placeholders: string[] = []
    let match

    while ((match = regex.exec(format)) !== null) {
      placeholders.push(match[1])
    }

    return placeholders
  }

  /**
   * Check if error strategy is valid
   */
  private isValidErrorStrategy(strategy: string): strategy is ErrorStrategy {
    return ['strict', 'skip', 'fallback'].includes(strategy)
  }

  /**
   * Check for duplicate command aliases
   */
  private checkDuplicateAliases(commands: CommandConfig[]): void {
    const aliases = new Set<string>()
    
    for (const cmd of commands) {
      if (aliases.has(cmd.alias)) {
        throw new ConfigValidationError(`Duplicate command alias: ${cmd.alias}`, 'alias')
      }
      aliases.add(cmd.alias)
    }
  }
}
