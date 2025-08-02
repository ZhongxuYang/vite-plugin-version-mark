# CHANGELOG

## v0.2.0

🎉 **Major Feature Release: Multi-Command Support**

* **NEW**: Multi-command support - Execute multiple commands and combine their results
* **NEW**: Custom format templates with `{alias}` placeholder syntax
* **NEW**: Error handling strategies: `strict`, `skip`, and `fallback`
* **NEW**: Parallel command execution for better performance
* **NEW**: Command configuration with aliases, timeouts, and fallback values
* **NEW**: Custom separators for combining results
* **ENHANCED**: Complete TypeScript type definitions with detailed JSDoc comments
* **ENHANCED**: Comprehensive test coverage (71 tests)
* **ENHANCED**: Updated documentation with multi-command examples
* **ENHANCED**: New playground demo project showcasing all features
* **MAINTAINED**: Full backward compatibility - existing string `command` configurations work unchanged

### Multi-Command Examples

```typescript
// Simple multi-command with default separator
command: {
  commands: [
    'git rev-parse --abbrev-ref HEAD',  // Get branch name
    'git rev-parse --short HEAD'        // Get short commit SHA
  ]
  // Output: "main-abc1234"
}

// Advanced multi-command with custom format
command: {
  commands: [
    { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD', fallback: 'unknown' },
    { alias: 'sha', cmd: 'git rev-parse --short HEAD', timeout: 5000 }
  ],
  format: '{branch}-{sha}',
  errorStrategy: 'fallback'
  // Output: "main-abc1234"
}
```

## v0.1.4
* Optimize tsup config type. (by [@chouchouji](https://github.com/ZhongxuYang/vite-plugin-version-mark/pull/16))

## v0.1.3
* Store script tag for global variable in `head` instead of `body`. (by [@richardvanthof](https://github.com/ZhongxuYang/vite-plugin-version-mark/pull/15))

## v0.1.2
* Fix type `VitePluginVersionMarkInput`.
* Update README.

## v0.1.1

* Support `outputFile`. (by [@peerless-hero](https://github.com/ZhongxuYang/vite-plugin-version-mark/pull/13))

## v0.1.0

* Yarn switch to pnpm.
* Add unit tests.
* Add commitlint.
* Change logo.

## v0.0.13

* Fix source Map warning on build.

## v0.0.12

* Update the confusing attributes `ifShortSHA` and `ifGitSHA`. If you want to enable `ifShortSHA`, you do not need to configure `ifGitSHA` to be `true`. (by [@littlecxm](https://github.com/ZhongxuYang/vite-plugin-version-mark/issues/8))
* The default value of `ifShortSHA` is changed to `false`.

## v0.0.11

* Support export version field in the entry file.

## v0.0.10

* Fix the bug that the `version` is not defined global after `ifGlobal: true`.

## v0.0.9

* The ifGlobal setting mode is switched to vite.define, so that the node.js environment can read. (by [@censujiang](https://github.com/ZhongxuYang/vite-plugin-version-mark/pull/4))

## v0.0.8

* Support provide a custom command to retrieve the version. (by [@kgutwin](https://github.com/kgutwin))

## v0.0.5 - v0.0.7

* Optimizations & support Nuxt3+.

## v0.0.1 - v0.0.4

* First release & bug fixing.