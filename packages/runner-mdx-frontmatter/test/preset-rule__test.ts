import presetReact from '@berun/preset-react'
import presetMdx from '@berun/runner-mdx'
import { create as berunJs } from '@berun/berun'
import presetMdxFrontMatter from '../src'

test('Gets Webpack additional/updated rules configuration', () => {
  const berun = berunJs(presetReact).use(presetMdx).use(presetMdxFrontMatter)
  berun.webpack.toConfig() // run once to set babel, jest config etc.

  expect(
    berun.webpack.module.rule('main').oneOf('markdown').toConfig()
  ).toEqual({
    test: /(\.(?:md|mdx))$/,
    include: ['/Volumes/DATA/projects/berun/packages/runner-mdx-frontmatter'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('main').oneOf('markdown').use('babel') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
          highlightCode: true,
          presets: ['@berun/babel-preset-react-app'],
          sourceType: 'unambiguous'
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('mdx') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/@mdx-js/loader/index.js',
        options: {
          remarkPlugins: expect.any(Array),
          rehypePlugins: expect.any(Array)
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
  const berun = berunJs(presetReact).use(presetMdx).use(presetMdxFrontMatter)
  berun.webpack.toConfig() // run once to set babel, jest config etc.
  expect(
    berun.webpack.module.rule('main').oneOf('markdown').toConfig()
  ).toEqual({
    test: /(\.(?:md|mdx))$/,
    include: ['/Volumes/DATA/projects/berun/packages/runner-mdx-frontmatter'],
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
          presets: ['@berun/babel-preset-react-app'],
          sourceType: 'unambiguous'
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('mdx') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/@mdx-js/loader/index.js',
        options: {
          remarkPlugins: expect.any(Array),
          rehypePlugins: expect.any(Array)
        }
      },
      /* berun.webpack.module.rule('main').oneOf('markdown').use('mdx') */
      {
        loader: expect.stringContaining('/loader/babel-fm-loader')
      }
    ]
  })
})
