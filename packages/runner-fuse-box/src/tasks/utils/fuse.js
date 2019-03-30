'use strict'

const { FuseBox } = require('fuse-box')
const path = require('path')
const express = require('express')

/**
 * Helper function to get FuseBox instance
 * */
module.exports.fuseCreate = (berun, port) => {
  require('fs').writeFileSync(
    require('path').join(process.cwd(), '.debug.fusebox.prod.js'),
    'module.exports=' +
      berun.fusebox.toString({ configPrefix: 'berun.fusebox' })
  )
  const config = berun.fusebox.toConfig()

  const fuse = FuseBox.init(berun.fusebox.toConfig())

  if (port)
    fuse.dev({ port: port, root: ['build', 'public'] }, server => {
      const app = server.httpServer.app
      app.use(express.static(berun.options.paths.appBuild))
      app.use(express.static(berun.options.paths.appPublic))
      app.get('*', function(req, res) {
        console.log(req.url)
        res.sendFile(path.resolve(berun.options.paths.appBuild, 'index.html'))
      })
    })

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
module.exports.fuseRun = fuse => {
  return new Promise((resolve, reject) => {
    let _error = console.error

    let errors = false

    console.error = function() {
      errors = true
      _error(...arguments)
      setTimeout(() => {
        reject(new Error('Build errors occurred'))
      }, 500)
    }

    return fuse
      .run({
        chokidar: {
          ignored: [/[\/\\]build.*/, /node_modules/, /(^|[\/\\])\../]
        }
      })
      .then(() => {
        console.error = _error
        if (errors) return reject(new Error('Build errors occurred'))
        resolve(true)
      })
  })
}
