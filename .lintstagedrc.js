import {ESLint} from 'eslint'

// 不校验eslintignore文件
const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file)
    }),
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  return filteredFiles.join(' ')
}

export default {
  '**/*.(js|mjs|cjs|jsx|vue|tsx|ts)': async (files) => {
    const filesToLint = await removeIgnoredFiles(files)
    return [
      `eslint --max-warnings=0 --fix ${filesToLint}`,
    ]
  },
}
