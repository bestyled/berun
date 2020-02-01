/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is included under the Facebook MIT license
 */
import path from 'path'

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

export default {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename))

    if (filename.match(/\.svg$/)) {
      return `export default {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: () => ${assetFilename},
      };`
    }

    return `export default ${assetFilename};`
  }
}
