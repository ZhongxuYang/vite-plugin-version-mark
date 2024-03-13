# CHANGELOG


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