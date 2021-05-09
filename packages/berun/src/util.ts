import * as path from 'path'

export const normalizePath = (base, url) =>
  path.isAbsolute(url) ? url : path.join(base, url)

export const requireFromRoot = (moduleId, root) => {
  const paths = [
    path.join(root, moduleId),
    path.join(root, 'node_modules', moduleId),
    moduleId
  ]

  const result = paths.find((p) => {
    try {
      require.resolve(p)
      return true
    } catch (err) {
      return p === paths[paths.length - 1]
    }
  })

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(result)
}

export const isPlainObject = (x) => {
  if (Object.prototype.toString.call(x) === '[object Object]') {
    const prototype = Object.getPrototypeOf(x)

    return prototype === null || prototype === Object.getPrototypeOf({})
  }

  return false
}
