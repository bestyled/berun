import presetJest from '../src'

const { Babel } = require('@berun/fluent-babel')

const berun_js = require('@berun/berun')

test('Gets Jest configuration once Babel configuration is set', () => {
  const berun = berun_js(Babel)
  berun.use(presetJest)

  berun.babel.merge({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: false
  })

  var expected_result = {
    resolver:
      '/Volumes/DATA/projects/berun/node_modules/jest-pnp-resolver/index.js',
    testEnvironment: 'node',
    testURL: 'http://localhost',
    rootDir: '/Volumes/DATA/projects/berun/packages/runner-jest',
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
    },
    collectCoverageFrom: ['src/**/*.{ts,tsx}', 'src/**/*.{js,jsx,mjs}'],
    setupFiles: [
      '/Volumes/DATA/projects/berun/node_modules/@berun/runner-web-polyfills/src/polyfills.js'
    ],
    testMatch: [
      '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
      '**/__tests__/**/*.{ts,tsx}',
      '**/?(*.)(spec|test).{ts,tsx}',
      '**/__tests__/**/*.{js,jsx,mjs}',
      '**/?(*.)(spec|test).{js,jsx,mjs}'
    ],
    roots: ['<rootDir>/src'],
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$'
    ],
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
    transform: {
      '^.+\\.(ts|tsx|js|jsx|mjs)$':
        '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/babelTransform.js',
      '^(?!.*\\.(ts|tsx|js|jsx|mjs|css|json|graphql)$)':
        '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/fileTransform.js',
      '^.+\\.css$':
        '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/cssTransform.js'
    },
    globals: {
      'ts-jest': {
        skipBabel: true
      }
    }
  }

  expect(berun.jest.toConfig()).toEqual(expected_result)
})
