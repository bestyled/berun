#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. Promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  console.error(err)
  throw err
})

//
// MAIN ENTRY POINT
//

const nodeArgs = process.argv
process.argv = nodeArgs

console.log(`running fix script in`, process.cwd())
require(`../dist`)
  