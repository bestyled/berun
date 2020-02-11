import * as deepmerge from 'deepmerge'
import Sparky from '@berun/sparky'
import * as spawn from 'cross-spawn'
import * as path from 'path'

import { defaultOptions } from './options'
import { isPlainObject, requireFromRoot } from './util'

export default class BeRun {
  options: any

  outputHandlers: Map<string, any>

  sparky: Sparky

  constructor(options?) {
    this.options = this._mergeOptions(defaultOptions, options)
    this.outputHandlers = new Map()
    this.sparky = new Sparky()

    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'production'
    }

    if (!process.env.GENERATE_SOURCEMAP) {
      process.env.GENERATE_SOURCEMAP = 'false'
    }

    const proxy = new Proxy(this, {
      get(self, property: string) {
        // eslint-disable-next-line no-nested-ternary
        return property in self
          ? self[property]
          : self.outputHandlers.has(property)
          ? self.outputHandlers.get(property)
          : undefined
      }
    })

    this.sparky.context(() => proxy)

    return proxy
  }

  regexFromExtensions(extensions: string[] = []) {
    const exts = extensions.map(ext => ext.replace('.', '\\.'))

    return new RegExp(
      extensions.length === 1
        ? String.raw`\.${exts[0]}$`
        : String.raw`\.(${exts.join('|')})$`
    )
  }

  register(name, handler) {
    this.outputHandlers.set(name, handler)
  }

  when(
    condition,
    whenTruthy: (berun: this) => void,
    whenFalsy?: (berun: this) => void
  ) {
    if (condition) {
      whenTruthy(this)
    } else if (whenFalsy) {
      whenFalsy(this)
    }

    return this
  }

  use(middleware, options?) {
    if (typeof middleware === 'function') {
      // If middleware is a function, invoke it with self and the provided options
      middleware(this, options)
    } else if (typeof middleware === 'string') {
      // If middleware is a string, it's a module to require.
      // Require it, then run the results back through .use()
      // with the provided options

      if (path.isAbsolute(middleware)) {
        this.use(require(middleware), options)
      } else {
        this.use(
          requireFromRoot(middleware, this.options.paths.appPath),
          options
        )
      }
    } else if (Array.isArray(middleware)) {
      // If middleware is an array, it's a pair of some other
      // middleware type and options
      this.use(middleware[0], middleware[1])
    } else if (isPlainObject(middleware)) {
      // If middleware is an object, it could contain other middleware in
      // its "use" property. Run every item in "use" prop back through .use(),
      // plus set any options.
      if (middleware.options) {
        this.options = this._mergeOptions(this.options, middleware.options)
      }

      if (middleware.use) {
        if (Array.isArray(middleware.use)) {
          middleware.use.map(usage => this.use(usage))
        } else {
          this.use(middleware.use)
        }
      }
    }

    return this
  }

  async useAsync(middleware, options?) {
    if (typeof middleware === 'function') {
      // If middleware is a function, invoke it with self and the provided options
      await middleware(this, options)
    } else if (typeof middleware === 'string') {
      // If middleware is a string, it's a module to require.
      // Require it, then run the results back through .use()
      // with the provided options
      if (path.isAbsolute(middleware)) {
        await this.useAsync(require(middleware), options)
      } else {
        await this.useAsync(
          requireFromRoot(middleware, this.options.paths.appPath),
          options
        )
      }
    } else if (Array.isArray(middleware)) {
      // If middleware is an array, it's a pair of some other
      // middleware type and options
      await this.useAsync(middleware[0], middleware[1])
    } else if (isPlainObject(middleware)) {
      // If middleware is an object, it could contain other middleware in
      // its "use" property. Run every item in "use" prop back through .use(),
      // plus set any options.
      if (middleware.options) {
        this.options = this._mergeOptions(this.options, middleware.options)
      }

      if (middleware.use) {
        if (Array.isArray(middleware.use)) {
          await Promise.all(
            middleware.use.map(async usage => {
              await this.use(usage)
            })
          )
        } else {
          await this.useAsync(middleware.use)
        }
      }
    }
  }

  spawn(cmd, argv) {
    const result = spawn.sync(cmd, argv, {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd()
    })

    if (result.stdout) {
      console.log(result.stdout.toString() + result.stderr.toString())
    }

    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        )
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        )
      }
      process.exit(1)
    }
  }

  _mergeOptions(options, newOptions) {
    Object.keys(newOptions).forEach(key => {
      const value = newOptions[key]

      // Only merge values if there is an existing value to merge with,
      // and if the value types match, and if the value types are both
      // objects or both arrays. Otherwise just replace the old value
      // with the new value.
      if (
        options[key] &&
        ((Array.isArray(options[key]) && Array.isArray(value)) ||
          (isPlainObject(options[key]) && isPlainObject(value)))
      ) {
        Object.assign(options, {
          [key]: (deepmerge as any)(options[key], newOptions[key])
        })
      } else {
        Object.assign(options, { [key]: newOptions[key] })
      }
    })

    return options
  }
}
