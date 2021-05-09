/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from 'path'
import * as fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const hasFlowConfig = fs.existsSync(resolveApp('.flowconfig'))
const hasTSConfig = fs.existsSync(resolveApp('tsconfig.json'))

const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === 'undefined') {
    value = defaultValue
  }

  if (typeof value !== 'boolean') {
    throw new Error(
      `Preset @berun/babel-preset-react-app: '${name}' option must be a boolean.`
    )
  }

  return value
}

export default function(_, opts) {
  if (!opts) {
    opts = {}
  }

  const env = process.env.BABEL_ENV || process.env.NODE_ENV

  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'
  const isFlowEnabled = validateBoolOption('flow', opts.flow, hasFlowConfig)
  const isTypeScriptEnabled = validateBoolOption(
    'typescript',
    opts.typescript,
    hasTSConfig
  )
  const areHelpersEnabled = validateBoolOption('helpers', opts.helpers, true)

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(
      `${'Using `@berun/babel-preset-react-app` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: '}${JSON.stringify(env)}.`
    )
  }

  if (isFlowEnabled && isTypeScriptEnabled) {
    throw new Error(
      'Cannot enable both flow and typescript support in the same project. ' +
        "Please make sure you don't have both .flowconfig and tsconfig.json files. '" +
        'If using .babelrc, set one option to false and the other one to true.'
    )
  }

  return {
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version
        require('@babel/preset-env').default,
        {
          targets: {
            node: '8.30'
          }
        }
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require('@babel/preset-env').default,
        {
          // We want @berun to be IE 9 compatible until React itself
          // no longer works with IE 9
          targets: isEnvProduction
            ? {
                ie: 9
              }
            : {
                chrome: 70
              },
          // Users cannot override this behavior because this Babel
          // configuration is highly tuned for ES5 support
          ignoreBrowserslistConfig: true,
          // If users import all core-js they're probably not concerned with
          // bundle size. We shouldn't rely on magic to try and shrink it.
          useBuiltIns: false,
          // Do not transform modules to CJS
          modules: false
        }
      ],
      [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true
        }
      ],
      isTypeScriptEnabled && [
        require('@babel/preset-typescript').default,
        {
          onlyRemoveTypeImports: true
        }
      ]
    ].filter(Boolean),
    plugins: [
      isFlowEnabled && [
        require('@babel/plugin-transform-flow-strip-types').default
      ],
      // Experimental macros support. Will be documented after it's had some time
      // in the wild.
      require('babel-plugin-macros'),
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      require('@babel/plugin-transform-destructuring').default,
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true
        }
      ],
      [
        require('@babel/plugin-proposal-private-methods').default,
        {
          loose: true
        }
      ],
      // The following two plugins use Object.assign directly, instead of Babel's
      // extends helper. Note that this assumes `Object.assign` is available.
      // { ...todo, completed: true }
      [
        require('@babel/plugin-proposal-object-rest-spread').default,
        {
          useBuiltIns: true
        }
      ],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      (isEnvTest || isEnvProduction) && [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: areHelpersEnabled,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: isEnvDevelopment || isEnvProduction,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: false // ** DISABLE FOR FUSE-BOX  **  absoluteRuntimePath
        }
      ],
      isEnvProduction && [
        // Remove PropTypes from production build
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true
        }
      ],
      // Adds syntax support for import()
      require('@babel/plugin-syntax-dynamic-import').default,
      isEnvTest &&
        // Transform dynamic import to require
        require('babel-plugin-transform-dynamic-import').default
    ].filter(Boolean)
  }
}
