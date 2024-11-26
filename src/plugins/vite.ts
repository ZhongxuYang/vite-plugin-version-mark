import {mkdir, writeFile} from 'node:fs/promises'
import {resolve,dirname} from 'node:path'
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
  let outDir: string

  return {
    name: 'vite-plugin-version-mark',

    async config() {
      const {
        ifGlobal,
        printName,
        printVersion,
      } = await getVersionMarkConfig()

      if (ifGlobal) {
        const keyName = `__${printName}__`
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
          injectTo: 'head',
          children: `console.log("${printInfo}")`,
        })
      }
      if (ifGlobal) {
        els.push({
          tag: 'script',
          injectTo: 'head',
          children: `__${printName}__ = "${printVersion}"`,
        })
      }

      return els
    },
    configResolved(config) {
      outDir = config.build.outDir
    },
    async closeBundle() {
      const {fileList} = await getVersionMarkConfig()
      if (!fileList.length) return
      await Promise.all(fileList.map(async ({path, content = ''}) => {
        try {
          const dir = dirname(path)
          await mkdir(resolve(outDir, dir), {recursive: true})
          const outputFilePath = resolve(outDir, path)
          await writeFile(outputFilePath, content)
          this.info(`Generate version file in ${outputFilePath}`)
        } catch (error) {
          this.error(`Failed to generate version file at ${path}: ${(error as Error).message}`)
        }
      }))
    },
  } as Plugin
}
