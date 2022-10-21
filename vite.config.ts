import {defineConfig} from 'vite'
import {resolve} from 'path'

export default defineConfig({
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), // 打包入口
      name: 'vitePluginVersionMark',
      formats: ['es', 'umd'],
      // fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: '[ext]/[name].[ext]',
      }
      // output: {
      //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      //   globals: {
      //     react: "React",
      //   },
      // },
    },
    outDir: "lib", // 打包后存放的目录文件
  }
})