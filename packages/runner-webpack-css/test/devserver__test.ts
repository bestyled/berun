import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetReactCss from '../src'

test('Gets devserver', () => {
  const berun = berunJs(presetReact)
  berun.use(presetReactCss)

  const expectedResult = {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    contentBase:
      '/Volumes/DATA/projects/berun/packages/runner-webpack-css/public',
    watchContentBase: true,
    hot: true,
    quiet: true,
    watchOptions: {
      ignored: /^(?!\/Volumes\/DATA\/projects\/berun\/packages\/runner-webpack-css\/src\/).+\/node_modules\//g
    },
    https: false,
    host: '0.0.0.0',
    overlay: false,
    historyApiFallback: {
      disableDotRule: true
    },
    public: expect.any(String),
    before: expect.any(Function)
  }

  expect(berun.devserver.toConfig()).toEqual(expectedResult)
})
