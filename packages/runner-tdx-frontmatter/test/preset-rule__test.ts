import presetReact from '@berun/preset-react'
import presetTdx from '@berun/runner-tdx'
import { create as berunJs } from '@berun/berun'
import presetTdxFrontMatter from '../src'

test('Gets Webpack additional/updated rules configuration', () => {
  const berun = berunJs(presetReact)
    .use(presetTdx)
    .use(presetTdxFrontMatter)
  berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('markdown')
      .toConfig()
  ).toEqual({
    test: /(\.(?:md|mdx|tdx))$/,
    include: ['/Volumes/DATA/projects/berun/packages/runner-tdx-frontmatter'],
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
          '/Volumes/DATA/projects/berun/node_modules/@tinia/tdx-loader/index.js',
        options: {
          mdPlugins: expect.any(Array),
          hastPlugins: expect.any(Array)
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('mdx') */
      {
        loader: expect.stringContaining('/loader/babel-fm-loader')
      }
    ]
  })
})

test('Gets Webpack production module rules configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact)
    .use(presetTdx)
    .use(presetTdxFrontMatter)
  berun.webpack.toConfig() // run once to set babel, jest config etc.
  expect(
    berun.webpack.module
      .rule('main')
      .oneOf('markdown')
      .toConfig()
  ).toEqual({
    test: /(\.(?:md|mdx|tdx))$/,
    include: ['/Volumes/DATA/projects/berun/packages/runner-tdx-frontmatter'],
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
      /* berun.webpack.module.rule('main').oneOf('markdown').use('tdx') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/@tinia/tdx-loader/index.js',
        options: {
          mdPlugins: expect.any(Array),
          hastPlugins: expect.any(Array)
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('tdx') */
      {
        loader: expect.stringContaining('/loader/babel-fm-loader')
      }
    ]
  })
})
