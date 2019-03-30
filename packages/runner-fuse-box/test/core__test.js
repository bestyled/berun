import { presetReact } from '../src/preset-react'
const berun_js = require('@berun/berun')

test('Gets FuseBox core configuration', () => {
  const berun = berun_js(presetReact)

  expect(berun.fusebox.get('homeDir')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-fuse-box/src'
  )
  expect(berun.fusebox.get('sourceMaps')).toEqual({
    project: true,
    vendor: false
  })
  expect(berun.fusebox.get('hash')).toEqual(false)
  expect(berun.fusebox.get('cache')).toEqual(true)
  expect(berun.fusebox.get('output')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-fuse-box/build/$name.js'
  )
  expect(berun.fusebox.get('target')).toEqual('browser@es2016')
})
