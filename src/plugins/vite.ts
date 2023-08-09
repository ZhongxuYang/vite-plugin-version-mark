import {analyticOptions} from './core/main'
import type {VitePluginVersionMarkInput, VitePluginVersionMarkConfig} from './core/main'
import type {Plugin, IndexHtmlTransformResult} from 'vite'

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
            [keyName]: JSON.stringify(printVersion)
          },
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
