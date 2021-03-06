import BeRunBase from './berun'

import { Babel } from './types/fluent-babel/Babel'
import { ESLint } from './types/fluent-eslint/ESLint'
import { Jest } from './types/fluent-jest/Jest'
import { Mdx } from './types/fluent-mdx/Mdx'
import { Prettier } from './types/fluent-prettier/Prettier'
import { Tdx } from './types/fluent-tdx/Tdx'
import { Config as Webpack, DevServer } from './types/fluent-webpack/index'

let _current

type BerunFunc = (berun: Berun, options?: any) => void

type Berun = BeRunBase & {
  babel?: Babel
  devserver?: DevServer
  eslint?: ESLint<never>
  jest?: Jest<never>
  mdx?: Mdx
  prettier?: Prettier<never>
  sparkyContext?: any
  tdx?: Tdx

  webpack?: Webpack
}

export const create = (middleware?: BerunFunc, options = {}) => {
  const berun = new BeRunBase(options)
  _current = berun

  if (middleware) {
    berun.use(middleware)
  } else {
    berun.use(berun.options.paths.config)
  }

  return berun as Berun
}

export const current = () => _current || create()

export default Berun
