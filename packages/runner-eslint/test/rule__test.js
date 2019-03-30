import presetReact from '@berun/preset-react'
import { presetESlint } from '@berun/runner-eslint'
const berun_js = require('@berun/berun')

test('Gets Webpack module rules configuration', () => {
  const berun = berun_js(presetReact)
  berun.use(presetESlint)
  const _ = berun.webpack.toConfig() // run once to set babel, eslint config etc.

  expect(berun.webpack.module.rule('eslint').toConfig()).toEqual({
    test: /\.(js|jsx|mjs|ts|tsx)$/,
    enforce: 'pre',
    include: ['/Volumes/DATA/projects/berun/packages/runner-eslint/src'],
    exclude: [/[\/\\]node_modules[\/\\]/],
    use: [
      /* berun.webpack.module.rule('eslint').use('eslint') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/eslint-loader/index.js',
        options: {
          formatter: expect.any(Function),
          eslintPath:
            '/Volumes/DATA/projects/berun/node_modules/eslint/lib/api.js',
          baseConfig: {
            extends: [
              '/Volumes/DATA/projects/berun/node_modules/eslint-config-react-app/index.js'
            ],
            settings: { react: { version: '999.999.999' } }
          },
          ignore: false,
          useEslintrc: false,
          rules: {
            noRedeclare: false
          }
        }
      }
    ]
  })
})
