import { create as berunJs } from '@berun/berun'
import presetReact from '../src'

test('Gets FuseBox bundle configuration', async () => {
  const berun = berunJs(presetReact)

  expect(berun.fusebox.bundle('app').get('instructions')).toEqual('>index.ts')

  expect(berun.fusebox.toBundles()).toEqual({
    app: { instructions: '>index.ts', hmr: null, watch: null }
  })

  // HACK to wait 1s to allow Fusebox enough time to tear down
  await new Promise((resolve, _) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})
