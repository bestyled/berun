import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetTSlint from '../src'

test('Gets Webpack module rules configuration', () => {
  const berun = berunJs(presetReact)
  berun.use(presetTSlint)
  berun.webpack.toConfig() // run once to set babel, tslint config etc.

  expect(berun.webpack.module.rule('tslint').toConfig()).toEqual({
    test: /\.(ts|tsx)$/,
    enforce: 'pre',
    include: ['/Volumes/DATA/projects/berun/packages/runner-tslint/src'],
    exclude: [/node_modules/],
    use: [
      /* berun.webpack.module.rule('tslint').use('tslint') */
      {
        loader:
          '/Volumes/DATA/projects/berun/node_modules/tslint-loader/index.js',
        options: {
          configFile: false,
          emitErrors: false,
          failOnHint: true,
          typeCheck: false,
          fix: false,
          configuration: {
            defaultSeverity: 'warning',
            extends: [
              'tslint:recommended',
              'tslint-react',
              'tslint-config-prettier'
            ],
            jsRules: {
              curly: true,
              'no-console': false
            },
            rules: {
              curly: true,
              'no-console': false,
              'member-access': false
            }
          }
        }
      }
    ]
  })
})