import {resolve} from 'node:path'
import {existsSync,readFileSync} from 'node:fs'
import {describe, test, expect} from 'vitest'
import {build, type InlineConfig} from 'vite'
import type {RollupOutput} from 'rollup'
import {vitePluginVersionMark, type VitePluginVersionMarkInput} from '../src'

const entryPathForVite = './fixtures/vite'
const entryFilenameForVite = 'index.html'
const entryPathForLib = './fixtures/lib'
const entryFilenameForLib = 'index.js'

async function buildVite(pluginConfig: VitePluginVersionMarkInput, entryPath: string, entryFilename: string, buildOptions: InlineConfig = {}) {
  const indexHtmlPath = resolve(__dirname, entryPath)

  const outputs = (await build({
    root: indexHtmlPath,
    plugins: [vitePluginVersionMark(pluginConfig)],
    ...buildOptions,
    // https://cn.vitejs.dev/config/shared-options.html#loglevel
    logLevel: 'error',
  })) as RollupOutput | RollupOutput[]

  const output = Array.isArray(outputs) ? outputs[0].output : outputs.output
  const file = output.find(
    item => item.fileName === entryFilename,
  )!
  let codeStr = ''
  if ('source' in file) {
    codeStr = file.source.toString()
  } else if ('code' in file) {
    codeStr = file.code
  }
  return codeStr
}

// https://github.com/Applelo/unplugin-inject-preload/blob/main/test/vite.test.ts#L24
describe('VitePlugin', () => {
  describe('Name', () => {
    test('assigned', async () => {
      const output = await buildVite(
        {
          name: 'my-test-name',
          version: '1.0.0',
          ifMeta: true,
          ifLog: true,
          ifGlobal: true,
          ifExport: true,
        },
        entryPathForVite,
        entryFilenameForVite,
      )
      expect(output).toMatchSnapshot()
    })
  })

  describe('Assigned version', () => {
    test('output: None', async () => {
      const output = await buildVite(
        {
          version: '1.0.0',
          ifMeta: false,
          ifLog: false,
          ifGlobal: false,
          ifExport: false,
        },
        entryPathForVite,
        entryFilenameForVite,
      )
      expect(output).toMatchSnapshot()
    })
  
    test('output: Meta', async () => {
      const output = await buildVite(
        {
          version: '1.0.0',
          ifMeta: true,
          ifLog: false,
          ifGlobal: false,
          ifExport: false,
        },
        entryPathForVite,
        entryFilenameForVite,
      )
      expect(output).toMatchSnapshot()
    })
  
    test('output: Log', async () => {
      const output = await buildVite(
        {
          version: '1.0.0',
          ifMeta: false,
          ifLog: true,
          ifGlobal: false,
          ifExport: false,
        },
        entryPathForVite,
        entryFilenameForVite,
      )
      expect(output).toMatchSnapshot()
    })
  
    test('output: Global', async () => {
      const output = await buildVite(
        {
          version: '1.0.0',
          ifMeta: false,
          ifLog: false,
          ifGlobal: true,
          ifExport: false,
        },
        entryPathForVite,
        entryFilenameForVite,
      )
      expect(output).toMatchSnapshot()
    })
  
    test('output: Export', async () => {
      const output = await buildVite(
        {
          version: '1.0.0',
          ifMeta: false,
          ifLog: false,
          ifGlobal: false,
          ifExport: true,
        },
        entryPathForLib,
        entryFilenameForLib,
        {
          build: {
            lib: {
              entry: './index.ts',
              name: 'index',
              fileName: 'index',
              formats: ['es'],
            },
          },
        },
      )
      expect(output).toMatchSnapshot()
    })

    test('output: File(true)', async () => {
      const outDir = resolve(__dirname, entryPathForVite, 'dist')
      await buildVite(
        {
          version: '1.0.0',
          outputFile: true,
          ifMeta: false,
          ifLog: false,
          ifGlobal: false,
          ifExport: false,
        },
        entryPathForLib,
        entryFilenameForLib,
        {
          build: {
            lib: {
              entry: './index.ts',
              name: 'index',
              fileName: 'index',
              formats: ['es'],
            },
            outDir,
          },
        },
      ) 
      const filePath = resolve(outDir, '.well-known/version')
      // File should be created
      expect(existsSync(filePath)).toBe(true) 
      // File should contain version
      expect(readFileSync(filePath, 'utf-8')).toEqual('1.0.0')
    })

    test('output: File(custom function)', async () => {
      const outDir = resolve(__dirname, entryPathForVite, 'dist')
      const customFilePath = resolve(outDir, 'custom/version.json')
      await buildVite(
        {
          version: '1.0.0',
          outputFile(version){
            return {
              path: customFilePath,
              content: `{"version":"${version}"}`,
            }
          },
          ifMeta: false,
          ifLog: false,
          ifGlobal: false,
          ifExport: false,
        },
        entryPathForLib,
        entryFilenameForLib,
        {
          build: {
            lib: {
              entry: './index.ts',
              name: 'index',
              fileName: 'index',
              formats: ['es'],
            },
            outDir,
          },
        },
      ) 
      // custom file should be created
      expect(existsSync(customFilePath)).toBe(true) 
      // custom file should contain version with json format
      expect(readFileSync(customFilePath, 'utf-8')).toEqual(JSON.stringify({'version': '1.0.0'}))
    })
  })



  // describe('longSHA', () => { })
  // describe('shortSHA', () => { })
  // describe('command', () => { })
  // describe('plugin usage', () => { })
})

// describe('NuxtPlugin', () => {})
