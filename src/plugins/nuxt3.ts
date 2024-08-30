// https://github.com/nuxt-modules/google-adsense/blob/master/src/module.ts
import {defineNuxtModule} from '@nuxt/kit'
import type {NuxtModule} from '@nuxt/schema'
import {VitePluginVersionMarkInput, analyticOptions} from './core'

type ModuleOptions = VitePluginVersionMarkInput

const nuxt3Module: NuxtModule<ModuleOptions> = defineNuxtModule({
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
    nuxt.options.vite.define = nuxt.options.vite.define || {}

    if (ifMeta) {
      nuxt.options.app.head.meta.push({
        name: 'application-name',
        content: printInfo,
      })
    }
    if (ifLog) { 
      nuxt.options.app.head.script.push({
        children: `console.log("${printInfo}")`,
      })
    }
    if (ifGlobal) {
      nuxt.options.vite.define[`__${printName}__`] = JSON.stringify(printVersion)
      nuxt.options.app.head.script.push({
        children: `__${printName}__ = "${printVersion}"`,
      })
    }
  },
})

export type {ModuleOptions}
export default nuxt3Module
