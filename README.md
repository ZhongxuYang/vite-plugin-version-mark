# vite-plugin-version-mark

> Automatically insert the version or git_commit_sha in your Vite/Nuxt project.

<div align="center">
  <a href="https://github.com/ZhongxuYang/vite-plugin-version-mark/tree/main">
    <img src="./docs/static/logo.svg" width="200px" />
  </a>
</div>

<div align="center">

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![types][types-src]][types-href]
[![License][license-src]][license-href]

[![Vite][vite-src]][vite-href]
[![Nuxt][nuxt-src]][nuxt-href]

[![Awesome][awesome-src]][awesome-href]

</div>

## Demo
![demo screen shot](./docs/static/iShot.png)

## Install
```sh
yarn add -D vite-plugin-version-mark
# OR npm install -D vite-plugin-version-mark
```

## Usage
### Vite
```ts
// vite.config.ts
import {defineConfig} from 'vite'
import {vitePluginVersionMark} from 'vite-plugin-version-mark'

export default defineConfig({
  plugins: [
    vitePluginVersionMark({
      // name: 'test-app',
      // version: '0.0.1',
      // command: 'git describe --tags',
      ifGitSHA: true,
      ifShortSHA: true,
      ifMeta: true,
      ifLog: true,
      ifGlobal: true,
    })
  ],
})
```

### Nuxt3+
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    ['vite-plugin-version-mark/nuxt', {
      // name: 'test-app',
      // version: '0.0.1',
      // command: 'git describe --tags',
      ifGitSHA: true, 
      ifShortSHA: true, 
      ifMeta: true, 
      ifLog: true, 
      ifGlobal: true,
    }]
  ],
})
```

Then you can use `vite-plugin-version-mark` ! 🎉

## Config

`vite-plugin-version-mark` can be print application version in the `Console` or add `<meta>` in HTML element. 

| name | description | type | default | supported |
| --- | --- | --- | --- | --- |
| name | application name | `string` | `name` in package.json | `0.0.1+` |
| version | application version | `string` | `version` in package.json | `0.0.1+` |
| ifGitSHA | use git commit SHA as the version | `boolean` | false | `0.0.1+` |
| ifShortSHA | use git commit short SHA as the version | `boolean` | true | `0.0.1+` |
| ifLog | print info in the Console | `boolean` | true | `0.0.1+` |
| ifGlobal | set a variable named *\`\_\_${APPNAME}\_VERSION\_\_\`* in the window | `boolean` | true | `0.0.4+` |
| ifMeta | add \<meta name="application-name" content="{APPNAME_VERSION}: {version}"> in the \<head> | `boolean` | true | `0.0.1+` |
| command | provide a custom command to retrieve the version <br/>For example: `git describe --tags` | `string` | git rev-parse --short HEAD | `0.0.8+` |


<!-- - `name` - application name (`name in package.json` by default)
- `version` - application version (`version in package.json` by default)
- `ifGitSHA` - use git commit SHA as the version (`false` by default)
- `ifShortSHA` - use git commit short SHA (`true` by default)
- `ifMeta` - add \<meta name="application-name" content="{APPNAME_VERSION}: {version}"> in the \<head> (`true` by default)
- `ifLog` - print info in the Console (`true` by default)
- `ifGlobal` - set a variable named *\`\_\_${APPNAME}\_VERSION\_\_\`* in the window. (`true` by default)
- `command` - provide a custom command to retrieve the version. For example: `git describe --tags` (`git rev-parse --short HEAD` by default) -->

View [CHANGELOG](./CHANGELOG.md)


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-version-mark/latest.svg?style=flat&colorA=18181B
[npm-version-href]: https://npmjs.com/package/vite-plugin-version-mark

[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-version-mark.svg?style=flat&colorA=18181B
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-version-mark

[types-src]: https://img.shields.io/npm/types/vite-plugin-version-mark.svg?style=flat&colorA=18181B
[types-href]: https://npmjs.com/package/vite-plugin-version-mark

[license-src]: https://img.shields.io/npm/l/vite-plugin-version-mark.svg?style=flat&colorA=18181B
[license-href]: https://npmjs.com/package/vite-plugin-version-mark

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt.js
[nuxt-href]: https://nuxt.com

[vite-src]: https://img.shields.io/badge/Vite-18181B?&logo=vite
[vite-href]: https://vitejs.dev

[awesome-src]: https://awesome.re/mentioned-badge.svg
[awesome-href]: https://github.com/vitejs/awesome-vite#transformers
