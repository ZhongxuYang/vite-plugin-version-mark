<div style="text-align: right;">

[中文](./README_ZH.md) | English

</div>

# vite-plugin-version-mark

> A Vite/Nuxt plugin that automatically injects version information (package.json version, git commit SHA, or custom commands) into your application via console, global variables, meta tags, and static files.

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
import { defineConfig } from "vite";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

export default defineConfig({
  plugins: [
    vitePluginVersionMark({
      // name: 'test-app',
      // version: '0.0.1',
      // command: 'git describe --tags',
      // outputFile: true,
      // ifGitSHA: true,
      ifShortSHA: true,
      ifMeta: true,
      ifLog: true,
      ifGlobal: true,
    }),
  ],
});
```

### Nuxt3+

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      "vite-plugin-version-mark/nuxt",
      {
        // name: 'test-app',
        // version: '0.0.1',
        // command: 'git describe --tags',
        // outputFile: true,
        // ifGitSHA: true,
        ifShortSHA: true,
        ifMeta: true,
        ifLog: true,
        ifGlobal: true,
      },
    ],
  ],
});
```

Then you can use `vite-plugin-version-mark` ! 🎉

> 🚀 **What's New in v0.2.0**: Multi-command support! Now you can execute multiple git commands and combine their results with custom formats. Perfect for creating version strings like `"main-abc1234"` or `"v1.0.0-main-abc1234"`. [See examples below](#multi-command-support--new-in-v020) ⬇️


## Config

> `vite-plugin-version-mark` can be print application version in the `Console`, defined `global` or add `<meta>` in HTML element.

| Name       | Description                                                                                                                                                                                                                                                              | Type                              | Default                    | Supported |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------------- | --------- |
| name       | application name                                                                                                                                                                                                                                                         | `string`                          | `name` in package.json     | `0.0.1+`  |
| version    | application version                                                                                                                                                                                                                                                      | `string`                          | `version` in package.json  | `0.0.1+`  |
| ifGitSHA   | use git commit SHA as the version                                                                                                                                                                                                                                        | `boolean`                         | false                      | `0.0.1+`  |
| ifShortSHA | use git commit short SHA as the version                                                                                                                                                                                                                                  | `boolean`                         | false                      | `0.0.1+`  |
| command    | provide a custom command to retrieve the version <br/>**New**: Now supports multiple commands! <br/>For example: `git describe --tags` or `{ commands: ['git branch --show-current', 'git rev-parse --short HEAD'], format: '{0}-{1}' }`                                 | `string` \| `MultiCommandOptions` | git rev-parse --short HEAD | `0.0.8+`  |
| ifLog      | print info in the Console                                                                                                                                                                                                                                                | `boolean`                         | true                       | `0.0.1+`  |
| ifGlobal   | set a variable named _\`\_\_${APPNAME}\_VERSION\_\_\`_ in the window<br/>[For TypeScript users, make sure to add the type declarations in the env.d.ts or vite-env.d.ts file to get type checks and Intellisense.](https://vitejs.dev/config/shared-options.html#define) | `boolean`                         | true                       | `0.0.4+`  |
| ifMeta     | add \<meta name="application-name" content="{APPNAME_VERSION}: {version}"> in the \<head>                                                                                                                                                                                | `boolean`                         | true                       | `0.0.1+`  |
| ifExport   | export the version field in the entry file. This may be used when you use vite to build a `library mode`.<br/>Through `import { {APPNAME}_VERSION } from <your_library_name>`                                                                                            | `boolean`                         | false                      | `0.0.11+` |
| outputFile | The build generates a static file based on the version, as described in the `outputFile` configuration below.                                                                                                                                                            | `boolean`/`function`              | false                      | `0.1.1+`  |

> The **version field** takes precedence: `command` > `ifShortSHA` > `ifGitSHA` > `version`


### Multi-Command Support 🎉 NEW in v0.2.0

Starting from version `0.2.0+`, `vite-plugin-version-mark` supports executing multiple commands and combining their results! This is perfect for creating version strings that include both branch name and commit SHA.

#### Basic Multi-Command Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

export default defineConfig({
  plugins: [
    vitePluginVersionMark({
      // Simple multi-command with default separator
      command: {
        commands: [
          "git rev-parse --abbrev-ref HEAD", // Get branch name
          "git rev-parse --short HEAD", // Get short commit SHA
        ],
        // Output: "main-abc1234"
      },
    }),
  ],
});
```

#### Advanced Multi-Command Configuration

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    vitePluginVersionMark({
      command: {
        commands: [
          {
            alias: "branch",
            cmd: "git rev-parse --abbrev-ref HEAD",
            fallback: "unknown",
          },
          { alias: "sha", cmd: "git rev-parse --short HEAD", timeout: 5000 },
          {
            alias: "tag",
            cmd: "git describe --tags --abbrev=0",
            fallback: "v0.0.0",
          },
        ],
        format: "{tag}-{branch}-{sha}", // Custom format template
        errorStrategy: "fallback", // Use fallback values on error
        parallel: true, // Execute commands in parallel
        // Output: "v1.0.0-main-abc1234"
      },
    }),
  ],
});
```

#### Multi-Command Options

| Option          | Description                                                            | Type                          | Default  |
| --------------- | ---------------------------------------------------------------------- | ----------------------------- | -------- |
| `commands`      | Array of commands to execute. Can be strings or command config objects | `(string \| CommandConfig)[]` | -        |
| `format`        | Template string with `{alias}` placeholders for formatting results     | `string`                      | -        |
| `separator`     | Default separator when no format template is provided                  | `string`                      | `"-"`    |
| `errorStrategy` | How to handle command failures: `"strict"`, `"skip"`, or `"fallback"`  | `string`                      | `"skip"` |
| `parallel`      | Whether to execute commands in parallel for better performance         | `boolean`                     | `true`   |

#### Error Handling Strategies

- **`strict`**: Any command failure will throw an error and stop the build
- **`skip`**: Failed commands are skipped, their results are empty in the output
- **`fallback`**: Use the `fallback` value specified in the command config when a command fails

#### Command Configuration

Each command can be configured with additional options:

```ts
interface CommandConfig {
  alias: string; // Alias for referencing in format template
  cmd: string; // The actual command to execute
  fallback?: string; // Fallback value if command fails
  timeout?: number; // Command timeout in milliseconds (default: 10000)
}
```


### `outputFile` Configuration Option

If you want to enable it, you can set it to `true`, and it will create a file with the path `.well-known/version` and the content of the current version number in the relative build directory (_dist_ for `vite` and _.output/public_ for `nuxt3`).

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

## Other

### How to get the version in your vitePlugin?

```ts
// vite.config.ts

import { defineConfig } from "vite";
import type { Plugin } from "vite";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

const yourPlugin: () => Plugin = () => ({
  name: "test-plugin",
  config(config) {
    // get version in vitePlugin if you open `ifGlobal`
    console.log(config.define);
  },
});

export default defineConfig({
  plugins: [
    vue(),
    vitePluginVersionMark({
      ifGlobal: true,
    }),
    yourPlugin(),
  ],
});
```

### How to get the branch to which it belongs through `commit SHA`?

Through the `git` command below, you can list all branches containing the specified `commit SHA`.

```sh
git branch -r --contains <COMMIT_SHA>
```

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
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt
[nuxt-href]: https://nuxt.com
[vite-src]: https://img.shields.io/badge/Vite-18181B?&logo=vite
[vite-href]: https://vitejs.dev
[awesome-src]: https://awesome.re/mentioned-badge.svg
[awesome-href]: https://github.com/vitejs/awesome-vite#transformers
