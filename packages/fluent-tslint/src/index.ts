import { TSLint as TSLintConfig } from './TSLint'
export { TSLintConfig }

export const TSLint = berun => {
  berun.tslint = new TSLintConfig()
}
