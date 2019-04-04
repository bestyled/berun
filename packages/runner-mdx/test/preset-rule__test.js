import presetReact from '@berun/preset-react'
import { presetMdx } from '../src'
const berun_js = require('@berun/berun')

test('Gets Webpack additional/updated rules configuration', () => {
  const berun = berun_js(presetReact).use(presetMdx)
  const _ = berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('markdown')
      .toConfig()
  ).toEqual({
    test: /(\.(?:md|mdx))$/,
    include: ['/Volumes/DATA/projects/berun/packages/runner-mdx'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('markdown').use('babel') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          cacheCompression: false,
          cacheDirectory: true,
          compact: false,
          highlightCode: true,
          presets: ['@berun/babel-preset-react-app']
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('mdx') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/@mdx-js/loader/index.js',
        options: {
          mdPlugins: expect.any(Array),
          hastPlugins: expect.any(Array)
        }
      }
    ]
  })
})

test('Gets Webpack production module rules configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berun_js(presetReact).use(presetMdx)
  const _ = berun.webpack.toConfig() // run once to set babel, jest config etc.
  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('markdown')
      .toConfig()
  ).toEqual({
    test: /(\.(?:md|mdx))$/,
    include: ['/Volumes/DATA/projects/berun/packages/runner-mdx'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('markdown').use('babel') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
          highlightCode: true,
          presets: ['@berun/babel-preset-react-app']
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('mdx') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/@mdx-js/loader/index.js',
        options: {
          mdPlugins: expect.any(Array),
          hastPlugins: expect.any(Array)
        }
      }
    ]
  })
})

test('Gets Webpack module rules configuration', () => {
  process.env.NODE_ENV = 'development'

  const berun = berun_js(presetReact).use(presetMdx)
  const _ = berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('image')
      .toConfig()
  ).toEqual({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    exclude: [/node_modules/],
    use: [
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/url-loader/dist/cjs.js',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('compile')
      .toConfig()
  ).toEqual({
    test: /\.(js|jsx|ts|tsx)$/,
    include: ['/Volumes/DATA/projects/berun'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('compile').use('babel') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          cacheCompression: false,
          cacheDirectory: true,
          compact: false,
          highlightCode: true,
          presets: ['@berun/babel-preset-react-app']
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('static')
      .toConfig()
  ).toEqual({
    exclude: [
      /\.(css|scss|sass|js|jsx|mjs|ts|tsx)$/,
      /\.ejs$/,
      /\.html$/,
      /\.json$/,
      /node_modules/,
      /\.(?:md|mdx)$/
    ],
    use: [
      /* berun.webpack.module.rule('main').oneOf('static').use('file') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/file-loader/dist/cjs.js',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  })
})

test('Gets Webpack production module rules configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berun_js(presetReact).use(presetMdx)
  const _ = berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('image')
      .toConfig()
  ).toEqual({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    exclude: [/node_modules/],
    use: [
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/url-loader/dist/cjs.js',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('compile')
      .toConfig()
  ).toEqual({
    test: /\.(js|jsx|ts|tsx)$/,
    include: ['/Volumes/DATA/projects/berun'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('compile').use('babel') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
          highlightCode: true,
          presets: ['@berun/babel-preset-react-app']
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('static')
      .toConfig()
  ).toEqual({
    exclude: [
      /\.(css|scss|sass|js|jsx|mjs|ts|tsx)$/,
      /\.ejs$/,
      /\.html$/,
      /\.json$/,
      /node_modules/,
      /\.(?:md|mdx)$/
    ],
    use: [
      /* berun.webpack.module.rule('main').oneOf('static').use('file') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/file-loader/dist/cjs.js',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  })
})
