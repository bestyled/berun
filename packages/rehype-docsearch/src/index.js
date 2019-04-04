const { default: docsearchDefault, docsearchSync: docsearchSyncDefault } = require('./docsearch')

module.exports.default  = function docsearch(src, options = { }) {
  return docsearchDefault(
    src,
    Object.assign(
      {
        hastPlugins: [],
        compilers: []
      },
      options
    )
  )
}

module.exports.docsearchSync  =  function docsearchSync(src, options = { }) {
  return docsearchSyncDefault(
    src,
    Object.assign(
      {
        hastPlugins: [],
        compilers: []
      },
      options
    )
  )
}
