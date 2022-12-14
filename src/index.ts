import childProcess from 'child_process'
import type {Plugin, IndexHtmlTransformResult} from 'vite'

interface VitePluginVersionMarkInput {
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
export const vitePluginVersionMark: (input?: VitePluginVersionMarkInput) => Plugin = (input = {}) => {
  const {
    name = process.env['npm_package_name'],
    version = process.env['npm_package_version'],
    ifGitSHA = false,
    ifShortSHA = true,
    ifMeta = true,
    ifLog = true,
    ifGlobal = true,
  } = input

  return {
    name: 'vite-plugin-version-mark',

    async transformIndexHtml() {
      const printVersion = ifGitSHA ? await getGitSHA(ifShortSHA) : version
      const printName = `${name?.replace(/((?!\w).)/g, '_')?.toLocaleUpperCase?.()}_VERSION`
      const printInfo = `${printName}: ${printVersion}`

      const els: IndexHtmlTransformResult = []
      ifMeta && els.push({
        tag: 'meta',
        injectTo: 'head-prepend',
        attrs: {
          name: 'application-name',
          content: printInfo,
        },
      })
      ifLog && els.push({
        tag: 'script',
        injectTo: 'body',
        children: `console.log("${printInfo}")`
      })
      ifGlobal && els.push({
        tag: 'script',
        injectTo: 'body',
        children: `__${printName}__ = "${printVersion}"`
      })

      return els
    },
  }
}
