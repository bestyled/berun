# @berun/fluent-fuse-box

Use a chaining API to generate and simplify the modification of
Fuse-Box configurations.

\_Note: This is is part of the broader `@berun/fluent` suite of configurations, but may be used standalone.

## Example

```js
berun.fusebox
  .homeDir('/Volumes/data/mypath')
  .sourceMaps({ project: true, vendor: false })
  .hash(true)
  .cache(true)
  .output(path.join('targetDir', '$name.js'))
  .target('browser@es2015')
  .plugin('Env')
  .use(EnvPlugin, ['development'])
  .end()
  .plugin('SVG')
  .use(SVGPlugin)
  .end()
  .plugin('CSS')
  .use(CSSPlugin)
  .end()
  .plugin('JSON')
  .use(JSONPlugin)
  .end()
  .plugin('WebIndex')
  .use(WebIndexPlugin, [
    {
      template: '/Volumes/data/src/index.html',
      path: '/'
    }
  ])
  .end()
  .plugin('Babel')
  .use(BabelPlugin)
  .end()
  .when(ISPRODUCTION, fusebox =>
    fusebox
      .plugin('Quantum')
      .use(Quantum, [{ removeExportsInterop: false, uglify: true }])
  )

berun.fusebox.plugins.delete('CSS')
```
