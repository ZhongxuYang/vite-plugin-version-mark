// https://github.com/nuxt-modules/google-adsense/blob/master/src/module.ts
import {mkdir, writeFile} from 'node:fs/promises'
import {resolve,dirname} from 'node:path'
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
      fileList,
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
    if (fileList.length > 0) {
      nuxt.hook('nitro:build:public-assets', async ({options: {output: {publicDir}}}) => {
        await Promise.all(fileList.map(async ({path, content = ''}) => {
          const dir = dirname(path)
          await mkdir(resolve(publicDir, dir), {recursive: true})
          const outputFilePath = resolve(publicDir, path)
          await writeFile(outputFilePath, content) 
          console.info(`Generate version file in ${outputFilePath}`)
        }))
      })
    }
  },
})

export type {ModuleOptions}
export default nuxt3Module
