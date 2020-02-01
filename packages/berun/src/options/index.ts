import getClientEnvironment from './env'
import * as paths from './paths'

export const defaultOptions = {
  paths
}

Object.defineProperty(defaultOptions, 'env', {
  get() {
    return getClientEnvironment(paths.publicUrl)
  },
  set(_) {
    /** noop */
  },
  enumerable: true,
  configurable: true
})
