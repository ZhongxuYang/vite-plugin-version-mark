import childProcess from 'child_process'

interface VitePluginVersionMarkBaseInput {
  name?: string
  version?: string
  ifMeta?: boolean
  ifLog?: boolean
  ifGlobal?: boolean
  ifExport?: boolean
}

interface VitePluginVersionMarkGitInput extends VitePluginVersionMarkBaseInput {
  ifGitSHA?: boolean
  ifShortSHA?: boolean
}
interface VitePluginVersionMarkCommandInput extends VitePluginVersionMarkBaseInput {
  command?: string
}
interface VitePluginVersionMarkFileInput extends VitePluginVersionMarkBaseInput {
  outputFile?: boolean | ((version: string) => ({ path: string, content: string })) | ((version: string) => ({ path: string, content: string })[])
}

export type VitePluginVersionMarkInput = VitePluginVersionMarkGitInput & VitePluginVersionMarkCommandInput & VitePluginVersionMarkFileInput

export type VitePluginVersionMarkConfig = {
  fileList: { path: string, content: string }[]
  ifMeta: boolean
  ifLog: boolean
  ifGlobal: boolean
  ifExport: boolean
  printVersion: string
  printName: string
  printInfo: string
}

const execCommand = (command: string) => {
  const {exec} = childProcess

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        const output = stdout.toString()?.replace('\n', '')
        resolve(output)
      }
    })
  })
}

export const analyticOptions: (options: VitePluginVersionMarkInput) => Promise<VitePluginVersionMarkConfig> = async (options) => {
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
  const finalCommand = command ?? (ifShortSHA ? 'git rev-parse --short HEAD' : ifGitSHA ? 'git rev-parse HEAD' : undefined)
  const printVersion = (finalCommand ? await execCommand(finalCommand) : version) as string
  const printName = `${name?.replace(/((?!\w).)/g, '_')?.toLocaleUpperCase?.()}_VERSION`
  const printInfo = `${printName}: ${printVersion}`
  const fileList = (() => {
    switch (typeof outputFile) {
    case 'function': {
      const res = outputFile(printVersion)
      return Array.isArray(res) ? res : [res] 
    }
    case 'boolean':
      return outputFile ? [{path: '.well-known/version', content: printVersion}] : [] 
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
