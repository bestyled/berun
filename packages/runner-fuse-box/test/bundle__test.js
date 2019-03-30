import { presetReact } from '../src/preset-react'
const berun_js = require('@berun/berun')

test('Gets FuseBox bundle configuration', async () => {
  const berun = berun_js(presetReact)

  expect(berun.fusebox.bundle('app').get('instructions')).toEqual('>index.js')

  expect(berun.fusebox.toBundles()).toEqual({
    app: { instructions: '>index.js', hmr: null, watch: null }
  })

  // HACK to wait 1s to allow Fusebox enough time to tear down
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})
