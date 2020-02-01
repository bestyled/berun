import { srcPolyfills } from '@berun/runner-web-polyfills'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import Berun from '@berun/berun'

// dependencies
import 'jest-pnp-resolver'
import 'babel-jest'
import './transforms/fileTransform.js'
import './transforms/cssTransform.js'

export default (berun: Berun, options: { paths?: any } = {}) => {
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.

  const rootDir = path.resolve(options.paths.appSrc, '..')
  const toRelRootDir = f => `<rootDir>/${path.relative(rootDir || '', f)}`

  const src = path.relative(rootDir, options.paths.appSrc)

  const setupTestsFile = fs.existsSync(options.paths.testsSetup)
    ? `<rootDir>/${src} /setupTests.js`
    : undefined

  berun.jest.merge({
    collectCoverageFrom: [`${src}/**/*.{ts,tsx}`, `${src}/**/*.{js,jsx,mjs}`],
    resolver: require.resolve('jest-pnp-resolver'),
    setupFiles: [srcPolyfills],
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: [
      '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
      '**/__tests__/**/*.{ts,tsx}',
      '**/?(*.)(spec|test).{ts,tsx}',
      '**/__tests__/**/*.{js,jsx,mjs}',
      '**/?(*.)(spec|test).{js,jsx,mjs}'
    ],
    // where to search for files/tests
    roots: [options.paths.appSrc].map(toRelRootDir),
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      babel: {
        test: '^.+\\.(ts|tsx|js|jsx|mjs)$',
        plugin: require.resolve('./transforms/babelTransform.js')
      },
      file: {
        test: '^(?!.*\\.(ts|tsx|js|jsx|mjs|css|json|graphql)$)',
        plugin: require.resolve('./transforms/fileTransform.js')
      },
      css: {
        test: '^.+\\.css$',
        plugin: require.resolve('./transforms/cssTransform.js')
      }
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$'
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
    },
    moduleFileExtensions: [
      'ts',
      'tsx',
      'web.js',
      'js',
      'json',
      'web.jsx',
      'jsx',
      'node',
      'mjs'
    ],
    globals: {
      'ts-jest': {
        skipBabel: true
      }
    }
  })

  if (rootDir) {
    berun.jest.merge({ rootDir })
  }

  const overrides = {
    ...require(options.paths.appPackageJson).jest
  }

  const supportedKeys = [
    'collectCoverageFrom',
    'coverageReporters',
    'coverageThreshold',
    'resetMocks',
    'resetModules',
    'snapshotSerializers',
    'watchPathIgnorePatterns'
  ]

  if (overrides) {
    const configToMerge = {}
    Object.keys(supportedKeys).forEach(key => {
      configToMerge[key] = overrides[key]
      delete overrides[key]
    })

    berun.jest.merge(configToMerge)

    const unsupportedKeys = Object.keys(overrides)
    if (unsupportedKeys.length) {
      const isOverridingSetupFile =
        unsupportedKeys.indexOf('setupTestFrameworkScriptFile') > -1

      if (isOverridingSetupFile) {
        console.error(
          chalk.red(
            `We detected ${chalk.bold(
              'setupTestFrameworkScriptFile'
            )} in your package.json.\n\n` +
              `Remove it from Jest configuration, and put the initialization code in ${chalk.bold(
                `${src}/setupTests.js`
              )}.\nThis file will be loaded automatically.\n`
          )
        )
      } else {
        console.error(
          chalk.red(
            `${'\nOut of the box, BeRun Jest Preset only supports overriding ' +
              'these Jest options:\n\n'}${supportedKeys
              .map(key => chalk.bold(`  \u2022 ${key}`))
              .join('\n')}.\n\n` +
              `These options in your package.json Jest configuration ` +
              `are not currently supported by BeRun Jest Preset :\n\n${unsupportedKeys
                .map(key => chalk.bold(`  \u2022 ${key}`))
                .join(
                  '\n'
                )}\n\nIf you wish to override other Jest options, you need to ` +
              ` use the ./config/berun.config.ts file ` +
              `in the package root direcotry\n`
          )
        )
      }

      process.exit(1)
    }
  }
}
