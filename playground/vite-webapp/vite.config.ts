import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import {vitePluginVersionMark} from '../../src/index'
// import {vitePluginVersionMark} from '../../dist/vite/index'
import {vitePluginVersionMark} from 'vite-plugin-version-mark'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginVersionMark({ 
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true 
    }),
  ],
})
