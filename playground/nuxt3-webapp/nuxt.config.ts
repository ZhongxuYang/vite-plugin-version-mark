// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    ['vite-plugin-version-mark/nuxt', {
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true
    }]
  ],
})
