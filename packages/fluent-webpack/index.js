module.exports.Config = require('webpack-chain/src/Config')
module.exports.DevServer = require('webpack-chain/src/DevServer')
module.exports.Module = require('webpack-chain/src/Module')
module.exports.Optimization = require('webpack-chain/src/Optimization')
module.exports.Output = require('webpack-chain/src/Output')
module.exports.Performance = require('webpack-chain/src/Performance')
module.exports.Resolve = require('webpack-chain/src/Resolve')
module.exports.ResolveLoader = require('webpack-chain/src/ResolveLoader')
module.exports.Rule = require('webpack-chain/src/Rule')
module.exports.Use = require('webpack-chain/src/Use')

module.exports.Webpack = berun => {
  berun.webpack = new module.exports.Config()
}

module.exports.WebpackDevServer = berun => {
  berun.devserver = new module.exports.DevServer()
}
