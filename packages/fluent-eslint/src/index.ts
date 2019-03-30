import { ESLint as ESLintConfig } from './ESLint'

export { ESLintConfig }

export const ESLint = berun => {
  berun.eslint = new ESLintConfig()
}
