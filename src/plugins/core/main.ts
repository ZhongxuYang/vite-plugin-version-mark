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

export type VitePluginVersionMarkInput = VitePluginVersionMarkGitInput & VitePluginVersionMarkCommandInput
export type VitePluginVersionMarkConfig = {
  ifMeta: boolean
  ifLog: boolean
  ifGlobal: boolean
  ifExport: boolean
  printVersion: string
  printName: string
  printInfo: string
}

const getGitSHA = (ifShortSHA: boolean, command: string | undefined) => {
  const {exec} = childProcess
  let sh: string
  if (command) {
    sh = command
  } else if (ifShortSHA) {
    sh = 'git rev-parse --short HEAD'
  } else {
    sh = 'git rev-parse HEAD'
  }

  return new Promise((resolve, reject) => {
    exec(sh, (error, stdout) => {
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
    ifGitSHA = false,
    ifShortSHA = true,
    ifMeta = true,
    ifLog = true,
    ifGlobal = true,
    ifExport = false,
    command = undefined,
  } = options

  const printVersion = (ifGitSHA ? await getGitSHA(ifShortSHA, command) : version) as string
  const printName = `${name?.replace(/((?!\w).)/g, '_')?.toLocaleUpperCase?.()}_VERSION`
  const printInfo = `${printName}: ${printVersion}`

  return {
    ifMeta,
    ifLog,
    ifGlobal,
    ifExport,
    printVersion,
    printName,
    printInfo,
  }
}
