import path from 'path'

export default berun => {
  const staticDirs = berun.options.paths.appPublic

  const watchPaths = Array.isArray(staticDirs)
    ? staticDirs.map(pathPublic => `${pathPublic}/**/*`)
    : `${staticDirs}/**/*`

  const publicArray = Array.isArray(staticDirs) ? staticDirs : [staticDirs]

  return berun.sparky.src(watchPaths).file(``, file => {
    const root = publicArray.find(
      element => file.root.substr(0, element.length) === element
    )
    const relativePath = root ? path.relative(root, file.root) : ''

    return file.copy(path.join(berun.options.paths.appBuild, relativePath))
  })
}
