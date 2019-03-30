import { presetReact } from '../src'
const berun_js = require('@berun/berun')

test('Gets FuseBox core configuration', () => {
  const berun = berun_js(presetReact)

  expect(berun.fusebox.get('homeDir')).toEqual(
    '/Volumes/DATA/projects/berun/packages/preset-fuse-box-react/src'
  )
  expect(berun.fusebox.get('sourceMaps')).toEqual({
    project: true,
    vendor: false
  })
  expect(berun.fusebox.get('hash')).toEqual(false)
  expect(berun.fusebox.get('cache')).toEqual(true)
  expect(berun.fusebox.get('output')).toEqual(
    '/Volumes/DATA/projects/berun/packages/preset-fuse-box-react/build/$name.js'
  )
  expect(berun.fusebox.get('target')).toEqual('browser@es2016')
})
