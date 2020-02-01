import Config from 'webpack-chain/src/Config'
import DevServer from 'webpack-chain/src/DevServer'

export { Config, DevServer }

export { default as Module } from 'webpack-chain/src/Module'
export { default as Optimization } from 'webpack-chain/src/Optimization'
export { default as Output } from 'webpack-chain/src/Output'
export { default as Performance } from 'webpack-chain/src/Performance'
export { default as Resolve } from 'webpack-chain/src/Resolve'
export { default as ResolveLoader } from 'webpack-chain/src/ResolveLoader'
export { default as Rule } from 'webpack-chain/src/Rule'
export { default as Use } from 'webpack-chain/src/Use'

export const Webpack = berun => {
  berun.webpack = new Config()
}

export const WebpackDevServer = berun => {
  berun.devserver = new DevServer()
}
