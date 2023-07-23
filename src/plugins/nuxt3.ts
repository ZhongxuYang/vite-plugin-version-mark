// https://github.com/nuxt-modules/google-adsense/blob/master/src/module.ts
import { defineNuxtModule } from '@nuxt/kit'
import { VitePluginVersionMarkInput, analyticOptions } from './core/main'
import { defineConstCore } from 'vite-plugin-global-const'

type ModuleOptions = VitePluginVersionMarkInput
const nuxtVersionMark = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-version-mark',
  },
  // https://github.com/nuxt/bridge/blob/main/packages/bridge/src/module.ts
  async setup(options, nuxt) {
    const {
      ifMeta,
      ifLog,
      ifGlobal,
      ifImportMeta,
      printVersion,
      printName,
      printInfo,
    } = await analyticOptions(options)

    nuxt.options.app.head.meta = nuxt.options.app.head.meta || []
    nuxt.options.app.head.script = nuxt.options.app.head.script || []

    ifMeta && nuxt.options.app.head.meta.push({
      name: 'application-name',
      content: printInfo,
    })
    ifLog && nuxt.options.app.head.script.push({
      children: `console.log("${printInfo}")`
    })
    ifGlobal && nuxt.options.app.head.script.push({
      children: `__${printName}__ = "${printVersion}"`
    })

    if (ifImportMeta === true) {
      const name = `__${printName}_VERSION__`
      const define = defineConstCore({
        [name]: printVersion
      })

      nuxt.options.vite.plugins = nuxt.options.vite.plugins || []
      nuxt.options.vite.plugins.push({
        name: 'nuxt-version-mark',
        config() {
          return {
            define,
          }
        },
      })
    }
  },
})

export type { ModuleOptions }
export default nuxtVersionMark
