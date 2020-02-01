import { FuseBox } from 'fuse-box'
import path from 'path'
import express from 'express'
import Berun from '@berun/berun'

/**
 * Helper function to get FuseBox instance
 * */
export const fuseCreate = (berun: Berun, port?) => {
  require('fs').writeFileSync(
    require('path').join(process.cwd(), '.debug.fusebox.prod.js'),
    `module.exports=${berun.fusebox.toString({
      configPrefix: 'berun.fusebox'
    })}`
  )

  // Always run toConfig once
  berun.fusebox.toConfig()

  const fuse = FuseBox.init(berun.fusebox.toConfig())

  if (port) {
    fuse.dev({ port, root: ['build', 'public'] as any }, server => {
      const { app } = server.httpServer
      app.use(express.static(berun.options.paths.appBuild))
      app.use(express.static(berun.options.paths.appPublic))
      app.get('*', (req, res) => {
        console.log(req.url)
        res.sendFile(path.resolve(berun.options.paths.appBuild, 'index.html'))
      })
    })
  }

  const bundles = berun.fusebox.toBundles()

  Object.keys(bundles).forEach(key => {
    const bundleConfig = bundles[key]

    const bundle = fuse.bundle(key)

    Object.keys(bundleConfig).forEach(bundleKey => {
      bundle[bundleKey](bundleConfig[bundleKey])
    })
  })

  return fuse
}

/**
 * Helper function to run FuseBox with automatic build error trapping
 * */
export const fuseRun = async fuse => {
  const _error = console.error

  let errors = false

  console.error = (...rest) => {
    errors = true
    _error(...rest)
  }

  await fuse.run({
    chokidar: {
      ignored: [/[/\\]build.*/, /node_modules/, /(^|[/\\])\../]
    }
  })

  console.error = _error
  if (errors) {
    throw new Error('Build errors occurred')
  }
  return true
}
