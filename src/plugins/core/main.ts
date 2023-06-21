import childProcess from 'child_process'

export interface VitePluginVersionMarkInput {
  name?: string
  version?: string
  ifGitSHA?: boolean
  ifShortSHA?: boolean
  gitCommand?: string
  ifMeta?: boolean
  ifLog?: boolean
  ifGlobal?: boolean
}

const getGitSHA = (ifShortSHA: boolean, gitCommand: string | undefined) => {
  const {exec} = childProcess
  let sh: string
  if (gitCommand) {
    sh = gitCommand
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

export const analyticOptions = async (options: VitePluginVersionMarkInput) => {
  const {
    name = process.env['npm_package_name'],
    version = process.env['npm_package_version'],
    ifGitSHA = false,
    ifShortSHA = true,
    gitCommand = undefined,
    ifMeta = true,
    ifLog = true,
    ifGlobal = true,
  } = options

  const printVersion = ifGitSHA ? await getGitSHA(ifShortSHA, gitCommand) : version
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
