import childProcess from 'child_process'

export interface VitePluginVersionMarkInput {
  name?: string
  version?: string
  ifGitSHA?: boolean
  ifShortSHA?: boolean
  ifMeta?: boolean
  ifLog?: boolean
  ifGlobal?: boolean
}

const getGitSHA = (ifShortSHA: boolean) => {
  const {exec} = childProcess
  const sh = ifShortSHA ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD'

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

export const analyticOptions = async (options: VitePluginVersionMarkInput) => {
  const {
    name = process.env['npm_package_name'],
    version = process.env['npm_package_version'],
    ifGitSHA = false,
    ifShortSHA = true,
    ifMeta = true,
    ifLog = true,
    ifGlobal = true,
  } = options

  const printVersion = ifGitSHA ? await getGitSHA(ifShortSHA) : version
  const printName = `${name?.replace(/((?!\w).)/g, '_')?.toLocaleUpperCase?.()}_VERSION`
  const printInfo = `${printName}: ${printVersion}`

  return {
    ifMeta,
    ifLog,
    ifGlobal,
    printVersion,
    printName,
    printInfo,
  }
}