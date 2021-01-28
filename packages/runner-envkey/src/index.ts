import Berun from '@berun/berun'
import { load, Options as LoaderOptions } from './loader'

interface Options extends LoaderOptions {
  define?: Record<string, any>
}

export default function mainEntryEnvKey(berun: Berun, opts: Options = {}) {
  load(opts)

  const raw = { ...berun.options.env.raw }

  for (const k of opts.permitted) {
    raw[k] = process.env[k]
  }

  if (opts.define) {
    for (const k in opts.define) {
      if (Object.prototype.hasOwnProperty.call(opts.define, k)) {
        raw[k] = opts.define[k]
      }
    }
  }

  berun.options.env = {
    raw,
    stringified: {
      'process.env': JSON.stringify(raw)
    }
  }
}
