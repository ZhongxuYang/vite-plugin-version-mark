import {defineNuxtModule} from '@nuxt/kit'
import {VitePluginVersionMarkInput, analyticOptions} from './core/main'

export const nuxtVersionMark = defineNuxtModule<VitePluginVersionMarkInput>({
  meta: {
    name: 'nuxt-version-mark',
  },
  // https://github.com/nuxt/bridge/blob/main/packages/bridge/src/module.ts
  async setup(options, nuxt) {
    const {
      ifMeta,
      ifLog,
      ifGlobal,
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
  }
})
