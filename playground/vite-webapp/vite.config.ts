import {defineConfig} from 'vite'
import type {Plugin} from 'vite'
import vue from '@vitejs/plugin-vue'
import {vitePluginVersionMark} from '../../dist/vite/index'

const testPlugin: () => Plugin = () => ({
  name: 'test-plugin',
  config (config) {
    // get version in vitePlugin if you open `ifGlobal`
    console.log(config.define)
  }
})
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
    vitePluginVersionMark({
      // ifGitSHA: true, 
      ifShortSHA: true,
      // command: 'git describe --tags',
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true,
      ifExport: true,
    }),
    testPlugin(),
  ],
})
