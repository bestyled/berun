import presetReact from '@berun/preset-react'
import { presetTSMain } from '../src'
const berun_js = require('@berun/berun')

test('Gets Webpack resolve configuration', () => {
  const berun = berun_js(presetReact)
  berun.use(presetTSMain)

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
    plugins: expect.arrayContaining([expect.any(Object)]),
    mainFields: ['ts:main', 'browser', 'module', 'main']
  })
})

test('Gets Webpack resolve Node onfiguration', () => {
  const berun = berun_js(presetReact)
  berun.webpack.target('node')
  berun.use(presetTSMain)

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
    plugins: expect.arrayContaining([expect.any(Object)]),
    mainFields: ['ts:main', 'module', 'main']
  })
})

test('Gets Webpack compile rule', () => {
  const berun = berun_js(presetReact)
  berun.use(presetTSMain)
  const _ = berun.webpack.toConfig() // run once to set babel config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('compile')
      .toConfig()
  ).toEqual({
    test: /\.(js|jsx|ts|tsx)$/,
    include: ['/Volumes/DATA/projects/berun'],
    exclude: [/[\/\\]node_modules[\/\\]/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('compile').use('babel') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          cacheDirectory: true,
          compact: false,
          highlightCode: true,
          presets: ['@berun/babel-preset-react-app']
        }
      }
    ]
  })
})
