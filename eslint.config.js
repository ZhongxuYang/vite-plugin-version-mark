import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import {includeIgnoreFile} from '@eslint/compat'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const customConfig = {
  rules: {
    'semi': ['error', 'never'], // 禁用分号
    'comma-dangle': ['error', 'always-multiline'], // 逗号悬垂
    'quotes': ['error', 'single'], // 单引号
    'object-curly-spacing': ['error', 'never'], // 对象内前后不允许空格
    'space-infix-ops': 'error', // 等号俩边必须空格
    'keyword-spacing': 'error', // 关键词 if else 等俩边必须有空格
    'eqeqeq': ['error', 'always'], // 使用全等
    'key-spacing': ['error', {'afterColon': true}], // 冒号后必须有空格
    'indent': ['warn', 2],
    'eol-last': ['error', 'always'],
  },
}

const ignoreGitignore = () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const gitignorePath = path.resolve(__dirname, '.gitignore')

  return includeIgnoreFile(gitignorePath)
}

export default [
  ignoreGitignore(),
  {files: ['**/*.{js,mjs,cjs,ts,vue,tsx,jsx}}'], ignorePath: '.gitignore'},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: 'module',
        parser: {
          ts: tsEslint.parser,
        },
      },
    },
  },
  customConfig,
]
