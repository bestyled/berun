import { create as berunJs } from '@berun/berun'
import presetReact from '../src/preset-react'

test('Gets Webpack core configuration', () => {
  const berun = berunJs(presetReact)

  expect(berun.webpack.get('mode')).toEqual('development')

  expect(berun.webpack.get('devtool')).toEqual('cheap-module-source-map')

  expect(berun.webpack.node.entries()).toEqual({
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    childProcess: 'empty'
  })

  expect(berun.webpack.output.entries()).toMatchObject({
    pathinfo: true,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: expect.any(Function)
  })

  expect(berun.webpack.performance.entries()).toEqual({
    hints: false
  })

  expect(berun.webpack.entry('main').values()).toEqual([
    '/Volumes/DATA/projects/berun/packages/runner-web-polyfills/src/polyfills.ts',
    '/Volumes/DATA/projects/berun/node_modules/react-dev-utils/webpackHotDevClient.js',
    '/Volumes/DATA/projects/berun/packages/runner-webpack/src/index.ts'
  ])

  expect(berun.webpack.module.get('strictExportPresence')).toEqual(true)

  expect(berun.webpack.module.rule('parser').entries()).toEqual({
    parser: {
      requireEnsure: false
    }
  })
})

test('Gets Webpack resolve configuration', () => {
  const berun = berunJs(presetReact)

  expect(berun.webpack.resolve.toConfig()).toMatchObject({
    alias: {
      '@babel/runtime':
        '/Volumes/DATA/projects/berun/node_modules/@babel/runtime',
      'react-native': 'react-native-web'
    },
    extensions: [
      '.ts',
      '.tsx',
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx'
    ],
    modules: ['node_modules'],
    plugins: expect.arrayContaining([expect.any(Object)])
  })
})

test('Gets Webpack production core configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact)

  expect(berun.webpack.get('mode')).toEqual('production')

  expect(berun.webpack.get('devtool')).toEqual(false)

  expect(berun.webpack.get('bail')).toEqual(true)

  expect(berun.webpack.node.entries()).toEqual({
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    childProcess: 'empty'
  })

  expect(berun.webpack.output.entries()).toMatchObject({
    path: '/Volumes/DATA/projects/berun/packages/runner-webpack/build',
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: expect.any(Function)
  })

  expect(berun.webpack.performance.entries()).toEqual({
    hints: false
  })

  expect(berun.webpack.entry('main').values()).toEqual([
    '/Volumes/DATA/projects/berun/packages/runner-web-polyfills/src/polyfills.ts',
    '/Volumes/DATA/projects/berun/packages/runner-webpack/src/index.ts'
  ])

  expect(berun.webpack.module.get('strictExportPresence')).toEqual(true)

  expect(berun.webpack.module.rule('parser').entries()).toEqual({
    parser: {
      requireEnsure: false
    }
  })
})

test('Gets Webpack production resolve configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact)

  expect(berun.webpack.resolve.toConfig()).toMatchObject({
    alias: {
      '@babel/runtime':
        '/Volumes/DATA/projects/berun/node_modules/@babel/runtime',
      'react-native': 'react-native-web'
    },
    extensions: [
      '.ts',
      '.tsx',
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx'
    ],
    modules: ['node_modules'],
    plugins: expect.arrayContaining([expect.any(Object)])
  })
})
