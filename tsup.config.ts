import {defineConfig, type Options} from 'tsup'

const defaultConfig: Options = {
  sourcemap: true,
  clean: true,
  dts: true,
  target: 'esnext',
  format: ['cjs', 'esm'],
}

export default defineConfig([
  {
    entry: {
      index: 'src/plugins/nuxt3.ts',
    },
    outDir: 'dist/nuxt',
    external: ['@nuxt/kit'],
    ...defaultConfig,
  },
  {
    entry: {
      index: 'src/plugins/vite.ts',
    },
    outDir: 'dist/vite',
    ...defaultConfig,
  },
])
