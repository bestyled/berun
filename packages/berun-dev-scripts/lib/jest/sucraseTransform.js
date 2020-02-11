const { transform } = require('sucrase')

function getTransforms(filename) {
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
    return ['jsx', 'imports']
  }
  if (filename.endsWith('.ts')) {
    return ['typescript', 'imports']
  }
  if (filename.endsWith('.tsx')) {
    return ['typescript', 'jsx', 'imports']
  }
  return null
}

module.exports = {
  process: (src, filename) => {
    const transforms = getTransforms(filename)
    if (transforms !== null) {
      const { code, sourceMap: map } = transform(src, {
        transforms,
        sourceMapOptions: { compiledFilename: filename },
        filePath: filename,
        enableLegacyTypeScriptModuleInterop: true
      })
      return { code, map }
    }
    return src
  }
}
