import path from 'path'

export function getLocalPages(bestatic) {
  let context, keys

  if (process.env.FuseBox) {
    // eslint-disable-next-line
    const fuseimport = Object.assign(
      {},
      FuseBox.import('./pages/*.mdx'),
      FuseBox.import('./pages/docs/*.mdx')
    )

    const loaders = Object.keys(fuseimport).reduce((accum, key) => {
      accum[
        '.' +
          path.sep +
          path.relative(bestatic.appPath, path.join(bestatic.workspace, key))
      ] = fuseimport[key]
      return accum
    }, {})

    keys = Object.keys(loaders)

    context = key => loaders[key]
  } else {
    // eslint-disable-next-line
    context = require.context(
      process.env.APP_PATH,
      true,
      /pages\/.*\.(md|mdx)$/
    )

    keys = context.keys()
  }

  const routes = keys
    .map(key => {
      const extname = path.extname(key)

      const name = path.basename(key, extname)

      if (/^_/.test(name)) return null

      const dirname = path
        .dirname(key)
        .replace(/^\./, '')
        .replace(/^[/\\]pages/, '')

      const exact = name == 'index'

      const pathname = dirname + '/' + (exact ? '' : name)

      const {
        default: Component,
        Component: _Component,
        meta = {},
        ...exports
      } = context(key)

      meta.name = meta.name || name

      if (typeof Component !== 'function') return null

      const route = {
        id: key,
        extname,
        exact,
        dirname,
        path: pathname,
        menu: true,
        meta,
        Component,
        getData: undefined,
        ...exports
      }

      return route
    })
    .filter(Boolean)

  return unflatten(routes)
}

function unflatten(routes) {
  const accum = []

  const sorted = routes.sort((a, b) => (a.path > b.path ? +1 : -1))
  sorted.forEach(route => {
    if (route.path == '/') {
      route.menu = false
      accum.push(route)
    } else if (route.path == '/docs/') {
      route.menu = true
      route.meta.name = 'Home'
      accum.push(route)
    } else if (
      route.dirname !== '' &&
      route.path !== '/' &&
      route.path !== '/docs/'
    ) {
      let parent = accum.find(r => r.path !== '/' && r.dirname == route.dirname)
      parent = parent || accum.find(r => r.path == '/docs/')
      if (!parent || parent.path == '/docs/') {
        route.Root = route.Root || parent.Root
        accum.push(route)
      } else {
        parent.children = parent.children || []
        parent.children.push(route)
        parent.exact = false
      }
    } else accum.push(route)
  })

  return accum
}
