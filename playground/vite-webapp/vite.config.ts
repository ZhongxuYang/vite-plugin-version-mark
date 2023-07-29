import {defineConfig} from 'vite'
import type {Plugin} from 'vite'
import vue from '@vitejs/plugin-vue'
// import {vitePluginVersionMark} from '../../src/index'
import {vitePluginVersionMark} from '../../dist/vite/index'
// import {vitePluginVersionMark} from 'vite-plugin-version-mark'

const testPlugin: () => Plugin = () => ({
  name: 'test-plugin',
  config (config) {
    // get version in vitePlugin if you open `ifGlobal`
    console.log(config.define)
  }
})
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginVersionMark({ 
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true,
      // command: 'git describe --tags'
    }),
    testPlugin(),
  ],
})
