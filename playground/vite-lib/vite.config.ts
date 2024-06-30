import { defineConfig } from 'vite'
import { vitePluginVersionMark } from '../../dist/vite/index'

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'Counter',
      fileName: 'counter'
    }
  },
  plugins: [
    vitePluginVersionMark({
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true,
      ifExport: true,
    }),
  ],
})
