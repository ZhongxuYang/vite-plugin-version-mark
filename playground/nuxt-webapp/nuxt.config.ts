import nuxtModule from '../../src/plugins/nuxt'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  modules: [
    [nuxtModule, {
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true,
      outputFile: true,
      command: {
        commands: [
          {alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD'},
          {alias: 'sha', cmd: 'git rev-parse --short HEAD'},
        ],
        format: '{branch}-{sha}',
        // separator: '-'
      },
    }],
  ],
})
