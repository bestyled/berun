import * as path from 'path'

const MAIN_FILE = require.main.filename
if (MAIN_FILE.indexOf('gulp.js') > -1 && !process.env.PROJECT_ROOT) {
  console.warn(
    "FuseBox wasn't able to detect your project root! You are running gulp!"
  )
  console.warn('Please set process.env.PROJECT_ROOT')
}

export class Configuration {
  public PROJECT_ROOT = process.env.PROJECT_ROOT || path.dirname(MAIN_FILE)
}

export const Config = new Configuration()
