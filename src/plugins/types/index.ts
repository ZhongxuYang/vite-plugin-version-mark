/**
 * Multi-command support type definitions
 *
 * This module provides type definitions for extending command parameter to support multiple command execution.
 * New features are fully backward compatible, existing
 */

/**
 * Error handling strategy
 *
 * @example
 * ```typescript
 * // Strict mode: throw error if any command fails
 * errorStrategy: 'strict'
 *
 * // Skip mode: skip failed commands, continue with others
 * errorStrategy: 'skip'
 *
 * // Fallback mode: use preset fallback values for failed commands
 * errorStrategy: 'fallback'
 * ```
 */
export type ErrorStrategy = 'strict' | 'skip' | 'fallback';

/**
 * Single command configuration
 *
 * Used to configure execution parameters for a single command, including alias, command, fallback value and timeout.
 *
 * @example
 * ```typescript
 * const commandConfig: CommandConfig = {
 *   alias: 'branch',
 *   cmd: 'git rev-parse --abbrev-ref HEAD',
 *   fallback: 'main',
 *   timeout: 5000
 * }
 * ```
 */
export interface CommandConfig {
  /**
   * Command alias, used to reference this command's result in format template
   *
   * @example "branch", "sha", "tag"
   */
  alias: string;

  /**
   * Actual command to execute
   *
   * @example "git rev-parse --abbrev-ref HEAD"
   */
  cmd: string;

  /**
   * Fallback value when command fails
   *
   * When errorStrategy is 'fallback' and command execution fails, this value will be used as result
   *
   * @example "unknown", "main", "v0.0.0"
   */
  fallback?: string;

  /**
   * Command timeout (milliseconds)
   *
   * @default 10000
   * @example 5000
   */
  timeout?: number;
}

/**
 * Multi-command configuration options
 *
 * Used to configure execution method and result formatting for multiple commands.
 *
 * @example
 * ```typescript
 * // Simple multi-command configuration
 * const simpleConfig: MultiCommandOptions = {
 *   commands: [
 *     'git rev-parse --abbrev-ref HEAD',
 *     'git rev-parse --short HEAD'
 *   ]
 * }
 *
 * // Complete multi-command configuration
 * const fullConfig: MultiCommandOptions = {
 *   commands: [
 *     { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD', fallback: 'main' },
 *     { alias: 'sha', cmd: 'git rev-parse --short HEAD', timeout: 5000 }
 *   ],
 *   format: '{branch}-{sha}',
 *   errorStrategy: 'fallback',
 *   parallel: true
 * }
 * ```
 */
export interface MultiCommandOptions {
  /**
   * Command list, supports strings or configuration objects
   *
   * - String: simple command, will use index as alias (0, 1, 2...)
   * - CommandConfig: complete command configuration object
   *
   * @example
   * ```typescript
   * // Mix strings and configuration objects
   * commands: [
   *   'git branch --show-current',  // alias will be "0"
   *   { alias: 'sha', cmd: 'git rev-parse --short HEAD' }
   * ]
   * ```
   */
  commands: (string | CommandConfig)[];

  /**
   * Format template, supports {alias} placeholder syntax
   *
   * Use aliases surrounded by curly braces to reference corresponding command results.
   * If not provided, will use separator to join all results.
   *
   * @example
   * ```typescript
   * format: '{branch}-{sha}'        // output: "main-abc1234"
   * format: 'v{tag}-{branch}'       // output: "v1.0.0-main"
   * format: '{0}-{1}'               // use index aliases
   * ```
   */
  format?: string;

  /**
   * Default separator, used when no format template is provided
   *
   * @default "-"
   * @example "_", ".", "+"
   */
  separator?: string;

  /**
   * Error handling strategy
   *
   * @default "skip"
   * @see ErrorStrategy
   */
  errorStrategy?: ErrorStrategy;

  /**
   * Whether to execute commands in parallel
   *
   * - true: all commands execute simultaneously, improves performance
   * - false: commands execute sequentially in order
   *
   * @default true
   */
  parallel?: boolean;
}

// Command execution result
export interface CommandResult {
  /** Command alias */
  alias: string;
  /** Original command */
  command: string;
  /** Execution result */
  result?: string;
  /** Error information */
  error?: Error;
  /** Execution time (milliseconds) */
  duration: number;
  /** Success status */
  success: boolean;
}

// Execution context
export interface ExecutionContext {
  /** Parsed command configuration list */
  commands: CommandConfig[];
  /** Multi-command options */
  options: MultiCommandOptions;
  /** Execution result mapping */
  results: Map<string, CommandResult>;
  /** Final version string */
  finalVersion: string;
}

// Multi-command execution error
export class MultiCommandError extends Error {
  constructor(
    message: string,
    public failedCommands: CommandResult[],
    public successCommands: CommandResult[],
  ) {
    super(message)
    this.name = 'MultiCommandError'
  }
}

// Base input interface (maintain existing structure)
export interface OutputFile {
  path: string;
  content: string;
}

export type OutputFileFunction = (version: string) => OutputFile | OutputFile[];

export interface VitePluginVersionMarkBaseInput {
  name?: string;
  version?: string;
  ifMeta?: boolean;
  ifLog?: boolean;
  ifGlobal?: boolean;
  ifExport?: boolean;
  outputFile?: boolean | OutputFileFunction;
}

// Git-related input interface
export interface VitePluginVersionMarkGitInput
  extends VitePluginVersionMarkBaseInput {
  ifGitSHA?: boolean;
  ifShortSHA?: boolean;
}

/**
 * Extended command input interface - supports string or multi-command configuration
 *
 * This interface extends the base input interface, adding support for multi-command configuration.
 * Fully backward compatible, existing string command configurations continue to work.
 */
export interface VitePluginVersionMarkCommandInput
  extends VitePluginVersionMarkBaseInput {
  /**
   * Command configuration, supports string (backward compatible) or multi-command object
   *
   * @example
   * ```typescript
   * // Backward compatible string configuration
   * command: 'git describe --tags'
   *
   * // Simple multi-command configuration
   * command: {
   *   commands: [
   *     'git rev-parse --abbrev-ref HEAD',
   *     'git rev-parse --short HEAD'
   *   ]
   * }
   *
   * // Complete multi-command configuration
   * command: {
   *   commands: [
   *     { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD' },
   *     { alias: 'sha', cmd: 'git rev-parse --short HEAD' }
   *   ],
   *   format: '{branch}-{sha}',
   *   errorStrategy: 'fallback'
   * }
   * ```
   */
  command?: string | MultiCommandOptions;
}

// Final input type
export type VitePluginVersionMarkInput = VitePluginVersionMarkGitInput &
  VitePluginVersionMarkCommandInput;

// Plugin configuration type
export type VitePluginVersionMarkConfig = {
  fileList: { path: string; content: string }[];
  ifMeta: boolean;
  ifLog: boolean;
  ifGlobal: boolean;
  ifExport: boolean;
  printVersion: string;
  printName: string;
  printInfo: string;
};
