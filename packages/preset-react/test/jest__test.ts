import { Babel } from '@berun/fluent-babel'
import { create as berunJs } from '@berun/berun'
import presetJest from '../src'

test('Gets Jest configuration once Babel configuration is set', () => {
  const berun = berunJs(Babel)
  berun.use(presetJest)

  berun.babel.merge({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: false
  })

  const expectedResult = {
    resolver:
      '/Volumes/DATA/projects/berun/node_modules/jest-pnp-resolver/index.js',
    testEnvironment: 'node',
    testURL: 'http://localhost',
    rootDir: '/Volumes/DATA/projects/berun/packages/preset-react',
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
    },
    collectCoverageFrom: ['src/**/*.{ts,tsx}', 'src/**/*.{js,jsx,mjs}'],
    setupFiles: [
      '/Volumes/DATA/projects/berun/packages/runner-web-polyfills/src/polyfills.ts'
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
      '^.+\\.(ts|tsx|js|jsx|mjs)$': expect.stringContaining('babelTransform'),
      '^(?!.*\\.(ts|tsx|js|jsx|mjs|css|json|graphql)$)': expect.stringContaining(
        'fileTransform'
      ),
      '^.+\\.css$': expect.stringContaining('cssTransform')
    },
    globals: {
      'ts-jest': {
        skipBabel: true
      }
    }
  }

  expect(berun.jest.toConfig()).toEqual(expectedResult)
})
