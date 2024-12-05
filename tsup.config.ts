import {defineConfig, type Format, type Options} from 'tsup'

const defaultConfig = {
  sourcemap: true,
  clean: true,
  dts: true,
  target: 'esnext' as Options['target'],
  format: ['cjs', 'esm'] as Format[],
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
