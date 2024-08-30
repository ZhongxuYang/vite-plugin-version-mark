import {analyticOptions} from './core'
import type {VitePluginVersionMarkInput, VitePluginVersionMarkConfig} from './core'
import type {Plugin, IndexHtmlTransformResult} from 'vite'

export type {VitePluginVersionMarkInput}
export const vitePluginVersionMark: (options?: VitePluginVersionMarkInput) => Plugin = (options = {}) => {
  let versionMarkConfig: VitePluginVersionMarkConfig
  const getVersionMarkConfig = async () => {
    if (!versionMarkConfig) versionMarkConfig = await analyticOptions(options)
    return versionMarkConfig
  }

  return {
    name: 'vite-plugin-version-mark',

    async config () {
      const {
        ifGlobal,
        printName,
        printVersion,
      } = await getVersionMarkConfig()

      if (ifGlobal) {
        const keyName =  `__${printName}__`
        return {
          define: {
            [keyName]: JSON.stringify(printVersion),
          },
        }
      }
    },

    async renderChunk(code, chunk) {
      if (chunk.isEntry) {
        const {
          ifExport,
          printName,
          printVersion,
        } = await getVersionMarkConfig()
        
        let modifiedCode = code
        if (ifExport) modifiedCode += `\nexport const ${printName} = '${printVersion}';`

        return {
          code: modifiedCode,
          map: null,
        }
      } 
    },

    async transformIndexHtml() {
      const {
        ifLog,
        ifMeta,
        ifGlobal,
        printName,
        printVersion,
        printInfo,
      } = await getVersionMarkConfig()

      const els: IndexHtmlTransformResult = []
      if (ifMeta) {
        els.push({
          tag: 'meta',
          injectTo: 'head-prepend',
          attrs: {
            name: 'application-name',
            content: printInfo,
          },
        })
      }
      if (ifLog) {
        els.push({
          tag: 'script',
          injectTo: 'body',
          children: `console.log("${printInfo}")`,
        })
      }
      if (ifGlobal) {
        els.push({
          tag: 'script',
          injectTo: 'body',
          children: `__${printName}__ = "${printVersion}"`,
        })
      }

      return els
    },
  }
}
