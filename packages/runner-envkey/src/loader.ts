// FORK of envkey-node without dotenv

import * as path from 'path'
import * as os from 'os'
import { execFile, execFileSync } from 'child_process'

const ENVKEY_FETCH_VERSION = '1.2.5'

export interface Options {
  permitted?: string[]
}

function pickPermitted(vars: Record<string, any>, opts: Options) {
  if (opts && opts.permitted && opts.permitted.length) {
    const res = {}
    for (const k in vars) {
      if (opts.permitted.indexOf(k) !== -1) {
        res[k] = vars[k]
      }
    }
    return res
  } else {
    opts.permitted = Object.keys(vars)
    return vars
  }
}

function applyVarsToEnv(vars: Record<string, any>) {
  const varsSet = {}
  for (const k in vars) {
    if (!process.env.hasOwnProperty(k)) {
      const val = vars[k]
      process.env[k] = val
      varsSet[k] = val
    }
  }

  return varsSet
}

function getKey(opts: Options) {
  return process.env.ENVKEY
}

function keyError() {
  return "ENVKEY invalid. Couldn't load vars."
}

function missingKeyError() {
  return "ENVKEY missing - must be set as an environment variable or in a gitignored .env file in the root of your project. Go to https://www.envkey.com if you don't know what an ENVKEY is."
}

function throwKeyError() {
  const err = keyError()
  throw err
}

function load(options: Options): void
function load(options: Options, callback: Function): void
function load(callback: Function): void
function load(optsOrCb: Options | Function, maybeCb?: Function): void {
  const opts = typeof optsOrCb === 'object' ? optsOrCb : ({} as Options)
  const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb
  let key: string

  try {
    key = getKey(opts)
  } catch (err) {
    if (cb) {
      cb(err)
    } else {
      throw err
    }
  }

  if (key) {
    if (cb) {
      fetch(key, opts, function (err: any, vars: any) {
        if (err) {
          cb(err)
        } else {
          cb(null, applyVarsToEnv(vars))
        }
      })
    } else {
      applyVarsToEnv(fetch(key, opts))
      return
    }
  } else if (cb) {
    cb(missingKeyError())
  } else {
    throw missingKeyError()
  }
}

function fetch(key: string, optsOrCb: Options, maybeCb?: Function)
function fetch(options: Options, maybeCb?: Function)
function fetch(callback: Function)
function fetch(
  keyOrCbOrOpts: string | Options | Function,
  optsOrCb?: Options | Function,
  maybeCb?: Function
) {
  let key: string, opts: Options, cb: Function

  if (typeof keyOrCbOrOpts === 'object') {
    opts = keyOrCbOrOpts
  } else if (typeof optsOrCb === 'object') {
    opts = optsOrCb
  } else {
    opts = {} as Options
  }

  if (typeof keyOrCbOrOpts === 'function') {
    cb = keyOrCbOrOpts
  } else if (typeof optsOrCb === 'function') {
    cb = optsOrCb
  } else {
    cb = maybeCb
  }

  try {
    key = typeof keyOrCbOrOpts === 'string' ? keyOrCbOrOpts : getKey(opts)
  } catch (err) {
    if (cb) {
      cb(err)
    } else {
      throw err
    }
  }

  if (!key && cb) {
    return cb(null, {})
  } else if (!key) {
    return {}
  }

  const platform = os.platform()
  const arch = os.arch()
  let platformPart
  let archPart

  switch (platform) {
    case 'darwin':
    case 'linux':
      platformPart = platform
      break
    case 'freebsd':
    case 'openbsd':
      platformPart = 'freebsd'
      break
    case 'win32':
      platformPart = 'windows'
      break
    default:
      platformPart = 'linux'
  }

  switch (arch) {
    case 'ia32':
    case 'x32':
    case 'x86':
    case 'mips':
    case 'mipsel':
    case 'ppc':
    case 's390':
      archPart = '386'
      break
    case 'x64':
    case 'ppc64':
    case 's390x':
      archPart = 'amd64'
      break
    default:
      archPart = '386'
  }

  let isDev = false

  if (['development', 'test'].indexOf(process.env.NODE_ENV) > -1) {
    isDev = true
  }

  const ext = platformPart === 'windows' ? '.exe' : '',
    filePath = path.join(
      path.dirname(require.resolve('envkey/package.json')),
      'ext',
      ['envkey-fetch', ENVKEY_FETCH_VERSION, platformPart, archPart].join('_'),
      'envkey-fetch' + ext
    ),
    execArgs = [
      key,
      isDev ? '--cache' : '',
      '--client-name',
      'envkey-node',
      '--client-version',
      '1.2.7'
    ]

  if (cb) {
    execFile(
      filePath,
      execArgs,
      function (err: any, stdoutStr: any, stderrStr: any) {
        if (err) {
          cb(stderrStr)
        } else if (stdoutStr.indexOf('error: ') === 0) {
          cb(stdoutStr)
        } else {
          const json = JSON.parse(stdoutStr)
          cb(null, pickPermitted(json, opts))
        }
      }
    )
  } else {
    try {
      const res = execFileSync(filePath, execArgs).toString()

      if (!res || !res.trim()) {
        throwKeyError()
      }

      const json = JSON.parse(res.toString())

      if (!json) {
        throwKeyError()
      }

      return pickPermitted(json, opts)
    } catch (e) {
      if (e.stderr) {
        console.error(e.stderr.toString())
        throw e.stderr.toString()
      } else {
        console.error(e.stack)
        throw e
      }
    }
  }
}

export { load, fetch }
