'use strict'

module.exports = (berun, options = {}) => {
  berun.prettier.files
    .add(
      '{,!(node_modules|dist|build)/**/}*.{js,jsx,ts,tsx,css,less,scss,sass,graphql,json,md}'
    )
    .end()
    .ignorePath('.gitignore')
    .write(true)
    .noConfig(true)
    .semi(false)
    .singleQuote(true)
}
