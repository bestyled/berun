import presetReact from '@berun/preset-fuse-box-react'
import { presetBeStatic } from '../src'
const berun_js = require('@berun/berun')

test('Gets FuseBox core configuration', async () => {
  const berun = berun_js(presetReact)
  berun.options.cmd = 'test:static'
  berun.use(presetBeStatic)

  expect(berun.fusebox.get('homeDir')).toEqual('/Volumes/DATA/projects/berun')

  expect(berun.fusebox.bundle('main').get('instructions')).toEqual(
    '>packages/bestatic-core/dist/entry_browser.js + packages/preset-bestatic/pages/**/*.*'
  )

  // HACK to wait 1s to allow Fusebox enough time to tear down
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})
