import nuxt3Module from '../../src/plugins/nuxt3'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  modules: [
    [nuxt3Module, {
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true,
      outputFile: true,
    }],
  ],
})
