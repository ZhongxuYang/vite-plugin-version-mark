<div style="text-align: right;">

[中文](./README_ZH.md) | English

</div>

# vite-plugin-version-mark

> Automatically insert the version or git_commit_sha in your Vite/Nuxt project.

<div align="center">
  <a href="https://github.com/ZhongxuYang/vite-plugin-version-mark/tree/main">
    <img src="https://raw.githubusercontent.com/ZhongxuYang/images/dev/common/version.svg" width="300px" height="100px" />
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

## Example

[![](https://raw.githubusercontent.com/ZhongxuYang/images/dev/common/version-shot.png)](https://zhongxuyang.github.io/vite-plugin-version-mark)

## Install
```sh
pnpm add -D vite-plugin-version-mark
# OR yarn add -D vite-plugin-version-mark
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
      // ifGitSHA: true,
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
      // ifGitSHA: true, 
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

> `vite-plugin-version-mark` can be print application version in the `Console`, defined `global` or add `<meta>` in HTML element. 

| Name | Description | Type | Default | Supported |
| --- | --- | --- | --- | --- |
| name | application name | `string` | `name` in package.json | `0.0.1+` |
| version | application version | `string` | `version` in package.json | `0.0.1+` |
| ifGitSHA | use git commit SHA as the version | `boolean` | false | `0.0.1+` |
| ifShortSHA | use git commit short SHA as the version | `boolean` | false | `0.0.1+` |
| command | provide a custom command to retrieve the version <br/>For example: `git describe --tags` | `string` | git rev-parse --short HEAD | `0.0.8+` |
| ifLog | print info in the Console | `boolean` | true | `0.0.1+` |
| ifGlobal | set a variable named *\`\_\_${APPNAME}\_VERSION\_\_\`* in the window<br/>[For TypeScript users, make sure to add the type declarations in the env.d.ts or vite-env.d.ts file to get type checks and Intellisense.](https://vitejs.dev/config/shared-options.html#define) | `boolean` | true | `0.0.4+` |
| ifMeta | add \<meta name="application-name" content="{APPNAME_VERSION}: {version}"> in the \<head> | `boolean` | true | `0.0.1+` |
| ifExport | export the version field in the entry file. This may be used when you use vite to build a `library mode`.<br/>Through `import { {APPNAME}_VERSION } from <your_library_name>` | `boolean` | false | `0.0.11+` |
| outputFile | The build generates a static file based on the version, as described in the `outputFile` configuration below. | `boolean`/`function` | false | `0.1.1+` |

> The **version field** takes precedence: `command` > `ifShortSHA`  > `ifGitSHA` > `version`


## Other

### How to get the version in your vitePlugin?
```ts
// vite.config.ts

import {defineConfig} from 'vite'
import type {Plugin} from 'vite'
import {vitePluginVersionMark} from 'vite-plugin-version-mark'

const yourPlugin: () => Plugin = () => ({
  name: 'test-plugin',
  config (config) {
    // get version in vitePlugin if you open `ifGlobal`
    console.log(config.define)
  }
})

export default defineConfig({
  plugins: [
    vue(),
    vitePluginVersionMark({
      ifGlobal: true,
    }),
    yourPlugin(),
  ],
})

```

### How to get the branch to which it belongs through `commit SHA`?

Through the `git` command below, you can list all branches containing the specified `commit SHA`.

```sh
git branch -r --contains <COMMIT_SHA>
```

### outputFile Configuration Option

If you want to enable it, you can set it to `true`, and it will create a file with the path `.well-known/version` and the content of the current version number in the relative build directory (*dist* for `vite` and *.output/public* for `nuxt3`).

Alternatively, it can be set to a function that takes the version number as a parameter and returns an object. This allows you to define the content information generated, for example:

```ts
// vite.config.ts
vitePluginVersionMark({
  // ...other options
  outputFile: (version) => ({
    path: 'custom/version.json',
    content: `{"version":"${version}"}`,
  })
}),
```

With this configuration, a file named `custom/version.json` will be generated, and its content will be `{"version":"${current version number}"}`.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ZhongxuYang/vite-plugin-version-mark&type=Date)](https://star-history.com/#ZhongxuYang/vite-plugin-version-mark&Date)


View [CHANGELOG](./CHANGELOG.md)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-version-mark/latest.svg?style=flat&colorA=18181B
[npm-version-href]: https://www.npmjs.com/package/vite-plugin-version-mark?activeTab=versions

[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-version-mark.svg?style=flat&colorA=18181B
[npm-downloads-href]: https://npmcharts.com/compare/vite-plugin-version-mark?interval=7&minimal=true

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
