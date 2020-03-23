import * as fs from 'fs'
import * as paths from './paths'

export const defaultOptions = {
  paths,
  env: fs.existsSync(paths.configEnv)
    ? require(paths.configEnv)[process.env.NODE_ENV] || require(paths.configEnv)
    : {}
}
