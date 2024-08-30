import {resolve} from 'node:path'
import {describe, test, expect} from 'vitest'
import {build} from 'vite'
import type {RollupOutput, OutputAsset, OutputChunk} from 'rollup'
import {vitePluginVersionMark, type VitePluginVersionMarkInput} from '../src'

const entryPathForVite = './fixtures/vite'
const entryFilenameForVite = 'index.html'
const entryPathForLib = './fixtures/lib'
const entryFilenameForLib = 'index.js'

async function buildVite(pluginConfig: VitePluginVersionMarkInput, entryPath, entryFilename, buildOptions = {}) {
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
  ) as OutputAsset | OutputChunk

  const codeStr = file.source || file.code
  
  return await codeStr.toString()
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
  })

  // describe('longSHA', () => { })
  // describe('shortSHA', () => { })
  // describe('command', () => { })
  // describe('plugin usage', () => { })
})

// describe('NuxtPlugin', () => {})
