export async function getRoutes(bestatic, config) {
  var routes = (await config.getRoutes(bestatic)).map(cleanRoute)

  routes.flattened = flatten(routes)

  return routes
}

function cleanRoute(route) {
  const result = Object.assign(
    {
      key: route.id || route.path,
      extname: '',
      dirname: '',
      exact: false
    },
    route
  )

  ;(result.meta.title =
    result.meta.name || result.path.replace(/[\/\\_]/g, '-').replace(/^-/, '')),
    (result.meta.title =
      result.meta.title.length > 25
        ? `${result.meta.title.substr(0, 25)}...`
        : result.meta.title)

  if (result.children) {
    result.children = result.children.map(cleanRoute)
  }

  return result
}

function flatten(routes, accum = []) {
  routes.forEach(route => {
    accum.push(route)

    if (route.children) {
      flatten(route.children, accum)
    }
  })

  return accum
}
