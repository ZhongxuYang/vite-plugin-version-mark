import {nuxtVersionMark} from '../../src/index'
// import {nuxtVersionMark} from '../../dist/index'
// import {nuxtVersionMark} from 'vite-plugin-version-mark'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    () => nuxtVersionMark({
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true 
    }),
  ],
})
