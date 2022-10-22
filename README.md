# vite-plugin-version-mark

> Automatically insert the version or git_commit_sha in your project

<p align="center">
  <img src="https://img.shields.io/npm/dm/vite-plugin-version-mark.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vite-plugin-version-mark"><img src="https://img.shields.io/npm/v/vite-plugin-version-mark.svg" alt="Version"></a>
  <a href="https://github.com/vuejs/vite-plugin-version-mark/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/vite-plugin-version-mark.svg" alt="License"></a>
</p>

## Install
```sh
yarn add -D vite-plugin-version-mark
# OR npm install -D vite-plugin-version-mark
```

## Usage
```ts
// vite.config.ts
import {defineConfig} from 'vite'
import {vitePluginVersionMark} from 'vite-plugin-version-mark'

export default defineConfig({
  plugins: [
    vitePluginVersionMark({
      ifGitSHA: true,
      ifShortSHA: true,
      ifMeta: true,
      ifLog: true,
    })
  ],
})
```

## Config

`vite-plugin-version-mark` can be print application version in the `Console` or add `<meta>` in HTML element.

- `name` - application name (`name in package.json` by default)
- `version` - application version (`version in package.json` by default)
- `ifGitSHA` - use git commit SHA as the version (`false` by default)
- `ifShortSHA` - use git commit short SHA (`true` by default)
- `ifMeta` - add \<meta name="application-name" content="${appName}$ version: ${version}$"> in the \<head> (`true` by default)
- `ifLog` - print info in the Console (`true` by default)

Then you can use `vite-plugin-version-mark` ! 🎉
