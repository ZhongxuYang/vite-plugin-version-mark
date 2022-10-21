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

Then you can use `vite-plugin-version-mark` ! 🎉
