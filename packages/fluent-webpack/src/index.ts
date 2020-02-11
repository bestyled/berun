import * as Config from 'webpack-chain/src/Config'
import * as DevServer from 'webpack-chain/src/DevServer'
import * as Module from 'webpack-chain/src/Module'
import * as Optimization from 'webpack-chain/src/Optimization'
import * as Output from 'webpack-chain/src/Output'
import * as Performance from 'webpack-chain/src/Performance'
import * as Resolve from 'webpack-chain/src/Resolve'
import * as ResolveLoader from 'webpack-chain/src/ResolveLoader'
import * as Rule from 'webpack-chain/src/Rule'
import * as Use from 'webpack-chain/src/Use'

export {
  Config,
  DevServer,
  Module,
  Optimization,
  Output,
  Performance,
  Resolve,
  ResolveLoader,
  Rule,
  Use
}

export const Webpack = berun => {
  berun.webpack = new Config()
}

export const WebpackDevServer = berun => {
  berun.devserver = new DevServer()
}
