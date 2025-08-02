import type {
  VitePluginVersionMarkInput,
  VitePluginVersionMarkConfig,
} from '../types'
import {ConfigurationParser} from './parser'
import {CommandExecutor} from './executor'
import {ResultFormatter} from './formatter'

export const analyticOptions: (
  options: VitePluginVersionMarkInput
) => Promise<VitePluginVersionMarkConfig> = async (options) => {
  const {
    name = process.env['npm_package_name'],
    version = process.env['npm_package_version'],
    command = undefined,
    ifShortSHA = false,
    ifGitSHA = false,
    ifMeta = true,
    ifLog = true,
    ifGlobal = true,
    ifExport = false,
    outputFile,
  } = options

  const parser = new ConfigurationParser()
  const parsedConfig = parser.parseCommandConfig(command)

  const executor = new CommandExecutor()

  // Determine final version info
  const printVersion = await (async () => {
    // Priority: command > ifShortSHA > ifGitSHA > version
    if (parsedConfig.commands.length > 0) {
      if (parsedConfig.isSingle) {
        // Single command mode (backward compatibility)
        const singleCommand = parsedConfig.commands[0].cmd
        return await executor.execSingleCommand(singleCommand)
      } else {
        // Multi-command mode
        const formatter = new ResultFormatter()

        const results = await executor.execMultipleCommands(
          parsedConfig.commands,
          {
            errorStrategy: parsedConfig.options.errorStrategy,
            parallel: parsedConfig.options.parallel,
          },
        )

        return formatter.format(
          results,
          parsedConfig.options.format,
          parsedConfig.options.separator,
        )
      }
    }
    if (ifShortSHA) {
      return await executor.execSingleCommand('git rev-parse --short HEAD')
    }
    if (ifGitSHA) {
      return await executor.execSingleCommand('git rev-parse HEAD')
    }
    return version as string
  })()

  const printName = `${name
    ?.replace(/((?!\w).)/g, '_')
    ?.toLocaleUpperCase?.()}_VERSION`
  const printInfo = `${printName}: ${printVersion}`
  const fileList = (() => {
    switch (typeof outputFile) {
    case 'function': {
      const res = outputFile(printVersion)
      return Array.isArray(res) ? res : [res]
    }
    case 'boolean':
      return outputFile
        ? [{path: '.well-known/version', content: printVersion}]
        : []
    default:
      return []
    }
  })()

  return {
    ifMeta,
    ifLog,
    ifGlobal,
    ifExport,
    fileList,
    printVersion,
    printName,
    printInfo,
  }
}
