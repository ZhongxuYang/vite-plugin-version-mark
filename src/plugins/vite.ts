import { VitePluginVersionMarkInput, analyticOptions } from './core/main'
import type { Plugin, IndexHtmlTransformResult } from 'vite'
import { defineConstCore } from 'vite-plugin-global-const'

export const vitePluginVersionMark: (options?: VitePluginVersionMarkInput) => Plugin = (options = {}) => {
  return {
    name: 'vite-plugin-version-mark',

    async transformIndexHtml() {
      const {
        ifMeta,
        ifLog,
        ifGlobal,
        printVersion,
        printName,
        printInfo,
      } = await analyticOptions(options)

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
    async config() {
      const {
        ifImportMeta,
        printVersion,
        printName,
      } = await analyticOptions(options)

      if (ifImportMeta === true) {
        const name = `__${printName}_VERSION__`
        const define = defineConstCore({
          [name]: printVersion
        })

        return {
          define
        }
      } else {
        return
      }
    }
  }
}
