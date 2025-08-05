<div style="text-align: right;">

中文 | [English](./README.md)

</div>

# vite-plugin-version-mark

> Vite/Nuxt插件，能自动将版本信息（如package.json中的版本号、Git SHA值或自定义命令）通过控制台、全局变量、元标签以及静态文件等方式注入到您的应用程序中。

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

## 使用样例

[![](https://raw.githubusercontent.com/ZhongxuYang/images/dev/common/version-shot.png)](https://zhongxuyang.github.io/vite-plugin-version-mark)

## 安装

```sh
pnpm add -D vite-plugin-version-mark
# 或者 yarn add -D vite-plugin-version-mark
# 或者 npm install -D vite-plugin-version-mark
```

## 使用

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

至此，你就在开始使用 `vite-plugin-version-mark` 啦! 🎉

> 🚀 **v0.2.0 新功能**：多命令支持！现在你可以执行多个 git 命令并使用自定义格式组合它们的结果。非常适合创建像 `"main-abc1234"` 或 `"v1.0.0-main-abc1234"` 这样的版本字符串。[查看下方示例](#command-多命令支持--v020-新功能) ⬇️

## 配置

> `vite-plugin-version-mark` 可以在 `Console` 中打印版本号，也可以在全局定义变量供您使用， 同时支持在 `<meta>` 标签中显示版本号。

| 属性       | 描述                                                                                                                                                                                                                                   | 类型                              | 默认值                                    | 支持版本  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------- | --------- |
| name       | 应用名                                                                                                                                                                                                                                 | `string`                          | 在 `package.json` 中定义的 `name` 属性    | `0.0.1+`  |
| version    | 应用版本                                                                                                                                                                                                                               | `string`                          | 在 `package.json` 中定义的 `version` 属性 | `0.0.1+`  |
| ifGitSHA   | 使用 git commitSHA 作为版本号                                                                                                                                                                                                          | `boolean`                         | false                                     | `0.0.1+`  |
| ifShortSHA | 使用 git 的短 commitSHA 作为版本号                                                                                                                                                                                                     | `boolean`                         | false                                     | `0.0.1+`  |
| command    | 提供自定义指令，以便自定义版本号的获取方式 <br/>**新功能**: 现在支持多命令！ <br/>例如使用 git tag 作为版本号: `git describe --tags` 或 `{ commands: ['git branch --show-current', 'git rev-parse --short HEAD'], format: '{0}-{1}' }` | `string` \| `MultiCommandOptions` | git rev-parse --short HEAD                | `0.0.8+`  |
| ifLog      | 在控制台打印版本信息                                                                                                                                                                                                                   | `boolean`                         | true                                      | `0.0.1+`  |
| ifGlobal   | 在 window 上定义变量 _\`\_\_${APPNAME}\_VERSION\_\_\`_ <br/>[对于 TypeScript 使用者, 请确保您在 env.d.ts 或者 vite-env.d.ts 文件中定义该变量，以便通过类型检查。](https://vitejs.dev/config/shared-options.html#define)                | `boolean`                         | true                                      | `0.0.4+`  |
| ifMeta     | 在 `<head>` 中添加 `<meta name="application-name" content="{APPNAME_VERSION}: {version}">`                                                                                                                                             | `boolean`                         | true                                      | `0.0.1+`  |
| ifExport   | 在入口文件导出版本字段。这在您使用 vite 构建 `library mode`时或许会用到。<br />通过 `import { {APPNAME}_VERSION} from <your_library_name>`                                                                                             | `boolean`                         | false                                     | `0.0.11+` |
| outputFile | 构建时根据版本生成一个静态文件，具体配置详见下方的 `outputFile` 配置项说明                                                                                                                                                             | `boolean`/`function`              | false                                     | `0.1.1+`  |

> **版本字段**的取值优先级为: `command` > `ifShortSHA` > `ifGitSHA` > `version`

### `command` 多命令支持 🎉 v0.2.0 新功能

从版本 `0.2.0+` 开始，`vite-plugin-version-mark` 支持执行多个命令并组合它们的结果！这非常适合创建包含分支名和提交 SHA 的版本字符串。

#### 基础多命令用法

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

export default defineConfig({
  plugins: [
    vitePluginVersionMark({
      // 使用默认分隔符的简单多命令配置
      command: {
        commands: [
          "git rev-parse --abbrev-ref HEAD", // 获取分支名
          "git rev-parse --short HEAD", // 获取短提交 SHA
        ],
        // 输出: "main-abc1234"
      },
    }),
  ],
});
```

#### 高级多命令配置

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
        format: "{tag}-{branch}-{sha}", // 自定义格式模板
        errorStrategy: "fallback", // 错误时使用回退值
        parallel: true, // 并行执行命令
        // 输出: "v1.0.0-main-abc1234"
      },
    }),
  ],
});
```

#### 多命令选项

| 选项            | 描述                                                     | 类型                          | 默认值   |
| --------------- | -------------------------------------------------------- | ----------------------------- | -------- |
| `commands`      | 要执行的命令数组，可以是字符串或命令配置对象             | `(string \| CommandConfig)[]` | -        |
| `format`        | 带有 `{alias}` 占位符的模板字符串，用于格式化结果        | `string`                      | -        |
| `separator`     | 未提供格式模板时的默认分隔符                             | `string`                      | `"-"`    |
| `errorStrategy` | 处理命令失败的方式：`"strict"`、`"skip"` 或 `"fallback"` | `string`                      | `"skip"` |
| `parallel`      | 是否并行执行命令以提高性能                               | `boolean`                     | `true`   |

#### 错误处理策略

- **`strict`**：任何命令失败都会抛出错误并停止构建
- **`skip`**：跳过失败的命令，它们的结果在输出中为空
- **`fallback`**：当命令失败时使用命令配置中指定的 `fallback` 值

#### 命令配置

每个命令都可以配置额外的选项：

```ts
interface CommandConfig {
  alias: string; // 在格式模板中引用的别名
  cmd: string; // 实际执行的命令
  fallback?: string; // 命令失败时的回退值
  timeout?: number; // 命令超时时间（毫秒），默认 10000
}
```


### `outputFile` 配置项说明

如需启用可设置为 `true`，会在相对构建目录（`vite` 默认为 _dist_，`nuxt3` 默认为 _.output/public_）下创建路径为 `.well-known/version` 的文件，内容为当前版本号。

也可以设置为一个函数，该函数接收版本号作为参数，并返回一个对象，以便自行定义生成的内容信息，例如：

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

如此配置便可以生成一个名为 `custom/version.json` 的文件，内容为 `{"version":"${当前版本号}"}`。

## 其它

### 如何在您的 vite 插件中获取版本号？

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

### 如何通过 `提交SHA` 来获取所属分支？

通过下方的 `git` 指令，可以列出所有包含指定 `提交SHA` 的分支。

```sh
git branch -r --contains <COMMIT_SHA>
```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ZhongxuYang/vite-plugin-version-mark&type=Date)](https://star-history.com/#ZhongxuYang/vite-plugin-version-mark&Date)

查看 [CHANGELOG](./CHANGELOG.md)

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
