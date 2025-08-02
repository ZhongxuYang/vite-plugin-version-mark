/**
 * Command executor - executes single or multiple commands
 */

import childProcess from 'child_process'
import type {CommandConfig, CommandResult, ErrorStrategy} from '../types'

// Command execution options
export interface CommandExecutionOptions {
  timeout?: number;
  errorStrategy?: ErrorStrategy;
  parallel?: boolean;
}

// Command execution error
export class CommandExecutionError extends Error {
  constructor(
    message: string,
    public command: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'CommandExecutionError'
  }
}

export class CommandExecutor {
  /**
   * Execute single command
   */
  async execSingleCommand(command: string, timeout = 10000): Promise<string> {
    const {exec} = childProcess

    return new Promise((resolve, reject) => {
      const child = exec(command, (error, stdout) => {
        if (error) {
          reject(
            new CommandExecutionError(
              `Command failed: ${command}`,
              command,
              error,
            ),
          )
        } else {
          const output = stdout.toString()?.trim()
          resolve(output)
        }
      })

      const timeoutId = setTimeout(() => {
        child.kill()
        reject(
          new CommandExecutionError(
            `Command timeout after ${timeout}ms: ${command}`,
            command,
          ),
        )
      }, timeout)

      child.on('exit', () => {
        clearTimeout(timeoutId)
      })
    })
  }

  /**
   * Execute multiple commands
   */
  async execMultipleCommands(
    commands: CommandConfig[],
    options: CommandExecutionOptions = {},
  ): Promise<Map<string, CommandResult>> {
    const {errorStrategy = 'skip', parallel = true} = options
    const results = new Map<string, CommandResult>()

    if (parallel) {
      // Parallel execution
      const promises = commands.map((cmd) => this.executeCommand(cmd))
      const commandResults = await Promise.allSettled(promises)

      commandResults.forEach((result, index) => {
        const cmd = commands[index]
        if (result.status === 'fulfilled') {
          const commandResult = result.value
          if (!commandResult.success) {
            const errorResult = this.applyErrorStrategy(
              commandResult,
              cmd,
              errorStrategy,
            )
            results.set(cmd.alias, errorResult)
          } else {
            results.set(cmd.alias, commandResult)
          }
        } else {
          const baseResult: CommandResult = {
            alias: cmd.alias,
            command: cmd.cmd,
            error: result.reason as Error,
            duration: 0,
            success: false,
          }

          const errorResult = this.applyErrorStrategy(
            baseResult,
            cmd,
            errorStrategy,
          )
          results.set(cmd.alias, errorResult)
        }
      })
    } else {
      // Serial execution
      for (const cmd of commands) {
        const result = await this.executeCommand(cmd)

        if (!result.success) {
          const errorResult = this.applyErrorStrategy(
            result,
            cmd,
            errorStrategy,
          )
          results.set(cmd.alias, errorResult)

          if (errorStrategy === 'strict') {
            throw result.error || new Error(`Command failed: ${cmd.cmd}`)
          }
        } else {
          results.set(cmd.alias, result)
        }
      }
    }

    if (errorStrategy === 'strict') {
      const failedCommands = Array.from(results.values()).filter(
        (result) => !result.success,
      )
      if (failedCommands.length > 0) {
        throw new CommandExecutionError(
          `${failedCommands.length} command(s) failed in strict mode`,
          failedCommands.map((cmd) => cmd.command).join(', '),
        )
      }
    }

    return results
  }

  /**
   * Execute single command configuration
   */
  private async executeCommand(config: CommandConfig): Promise<CommandResult> {
    const startTime = Date.now()

    try {
      const result = await this.execSingleCommand(config.cmd, config.timeout)
      const duration = Date.now() - startTime

      return {
        alias: config.alias,
        command: config.cmd,
        result,
        duration,
        success: true,
      }
    } catch (error) {
      const duration = Date.now() - startTime

      return {
        alias: config.alias,
        command: config.cmd,
        error: error as Error,
        duration,
        success: false,
      }
    }
  }

  /**
   * Apply error handling strategy
   */
  private applyErrorStrategy(
    baseResult: CommandResult,
    config: CommandConfig,
    errorStrategy: ErrorStrategy,
  ): CommandResult {
    switch (errorStrategy) {
    case 'fallback':
      if (config.fallback !== undefined) {
        return {
          ...baseResult,
          result: config.fallback,
          success: true,
          error: undefined,
        }
      }
      return {
        ...baseResult,
        result: '',
      }
    case 'skip':
      return {
        ...baseResult,
        result: '',
      }
    case 'strict':
      return baseResult
    default:
      return baseResult
    }
  }
}
