import presetReact from '@berun/preset-react'
import presetESlint from '@berun/runner-eslint'
import { create as berunJs } from '@berun/berun'

test('Gets Webpack module rules configuration', () => {
  const berun = berunJs(presetReact)
  berun.use(presetESlint)
  berun.webpack.toConfig() // run once to set babel, eslint config etc.

  expect(berun.webpack.module.rule('eslint').toConfig()).toEqual({
    test: /\.(js|jsx|mjs|ts|tsx)$/,
    enforce: 'pre',
    include: ['/Volumes/DATA/projects/berun/packages/runner-eslint/src'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('eslint').use('eslint') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/eslint-loader/dist/cjs.js',
        options: {
          formatter: expect.any(Function),
          eslintPath:
            '/Volumes/DATA/projects/berun/node_modules/eslint/lib/api.js',
          baseConfig: {
            extends: [
              '/Volumes/DATA/projects/berun/node_modules/@sync-labs/eslint-config/profile/node.js'
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
