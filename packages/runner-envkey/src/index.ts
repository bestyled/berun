import Berun from '@berun/berun'
import { load, Options as LoaderOptions } from './loader'

interface Options extends LoaderOptions {
  define?: Record<string, any>
}

export default function mainEntryEnvKey(berun: Berun, opts: Options = {}) {
  load(opts)

  const result = { ...berun.options.env }

  for (const k of opts.permitted) {
    result[k] = process.env[k]
  }

  if (opts.define) {
    for (const k in opts.define) {
      if (Object.prototype.hasOwnProperty.call(opts.define, k)) {
        result[k] = opts.define[k]
      }
    }
  }

  berun.options.env = result
}
