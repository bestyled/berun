import presetReact from '@berun/preset-fuse-box-react'
import { create as berunJs } from '@berun/berun'
import presetBeStatic from '../src'

test('Gets FuseBox core configuration', async () => {
  const berun = berunJs(presetReact)
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
