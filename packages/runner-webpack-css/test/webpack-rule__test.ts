import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetReactCss from '../src'

test('Gets Webpack  module extended rules configuration', () => {
  const berun = berunJs(presetReact).use(presetReactCss)
  berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('post-css')
      .toConfig()
  ).toEqual({
    test: /\.css$/,
    exclude: [/\.module\.css$/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('post-css').use('style') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/style-loader/dist/cjs.js'
      },
      /* berun.webpack.module.rule('main').oneOf('post-css').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 1,
          sourceMap: false
        }
      },
      /* berun.webpack.module.rule('main').oneOf('post-css').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: false
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('css-module')
      .toConfig()
  ).toEqual({
    test: /\.module\.css$/,
    use: [
      /* berun.webpack.module.rule('main').oneOf('css-module').use('style') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/style-loader/dist/cjs.js'
      },
      /* berun.webpack.module.rule('main').oneOf('css-module').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 1,
          modules: true,
          getLocalIdent: expect.any(Function),
          sourceMap: false
        }
      },
      /* berun.webpack.module.rule('main').oneOf('css-module').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: false
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('sass')
      .toConfig()
  ).toEqual({
    test: /\.(scss|sass)$/,
    exclude: [/\.module\.(scss|sass)$/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('sass').use('style') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/style-loader/dist/cjs.js'
      },
      /* berun.webpack.module.rule('main').oneOf('sass').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 2,
          sourceMap: false
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: false
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass').use('pre-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/sass-loader/dist/cjs.js'
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('sass-module')
      .toConfig()
  ).toEqual({
    test: /\.module\.(scss|sass)$/,
    use: [
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('style') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/style-loader/dist/cjs.js'
      },
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 2,
          modules: true,
          getLocalIdent: expect.any(Function),
          sourceMap: false
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: false
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('pre-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/sass-loader/dist/cjs.js'
      }
    ]
  })
})

test('Gets Webpack production module exgtended rules configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact).use(presetReactCss)
  berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('post-css')
      .toConfig()
  ).toEqual({
    test: /\.css$/,
    exclude: [/\.module\.css$/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('post-css').use('minicss') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
      },
      /* berun.webpack.module.rule('main').oneOf('post-css').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 1,
          sourceMap: true
        }
      },
      /* berun.webpack.module.rule('main').oneOf('post-css').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: true
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('css-module')
      .toConfig()
  ).toEqual({
    test: /\.module\.css$/,
    use: [
      /* berun.webpack.module.rule('main').oneOf('css-module').use('minicss') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
      },
      /* berun.webpack.module.rule('main').oneOf('css-module').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 1,
          sourceMap: true,
          modules: true,
          getLocalIdent: expect.any(Function)
        }
      },
      /* berun.webpack.module.rule('main').oneOf('css-module').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: true
        }
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('sass')
      .toConfig()
  ).toEqual({
    test: /\.(scss|sass)$/,
    exclude: [/\.module\.(scss|sass)$/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('sass').use('minicss') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
      },
      /* berun.webpack.module.rule('main').oneOf('sass').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 2,
          sourceMap: true
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: true
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass').use('pre-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/sass-loader/dist/cjs.js'
      }
    ]
  })

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('sass-module')
      .toConfig()
  ).toEqual({
    test: /\.module\.(scss|sass)$/,
    use: [
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('minicss') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
      },
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
        options: {
          importLoaders: 2,
          sourceMap: true,
          modules: true,
          getLocalIdent: expect.any(Function)
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('post-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
        options: {
          ident: 'postcss',
          plugins: expect.any(Function),
          sourceMap: true
        }
      },
      /* berun.webpack.module.rule('main').oneOf('sass-module').use('pre-css') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/sass-loader/dist/cjs.js'
      }
    ]
  })
})
