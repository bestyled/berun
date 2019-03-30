import presetReact from '@berun/preset-react'
import { presetMdx } from '../src'
const berun_js = require('@berun/berun')

test('Gets devserver', () => {
  const berun = berun_js(presetReact)
  berun.use(presetMdx)

  var expected_result = {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    contentBase: '/Volumes/DATA/projects/berun/packages/runner-mdx/public',
    watchContentBase: true,
    hot: true,
    quiet: true,
    watchOptions: {
      ignored: /^(?!\/Volumes\/DATA\/projects\/berun\/packages\/runner-mdx\/src\/).+\/node_modules\//g
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

  expect(berun.devserver.toConfig()).toEqual(expected_result)
})
