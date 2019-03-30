import { presetReact } from '../src/preset-react'
const berun_js = require('@berun/berun')

test('Gets Fusebox plugin configuration', () => {
  const berun = berun_js(presetReact)
  const _ = berun.fusebox.toConfig() // call toConfig to set babel plugin

  expect(
    berun.fusebox.plugins.values().map(plugin => {
      const c = plugin.toConfig()
      return {
        name: c.__pluginName,
        args: c.__pluginArgs || []
      }
    })
  ).toEqual([
    {
      args: [
        {
          FuseBox: true,
          NODE_ENV: 'test',
          APP_PATH: '/Volumes/DATA/projects/berun/packages/runner-fuse-box',
          DIRECTORIES: {},
          PUBLIC_URL: '',
          REMOTE_ORIGIN_URL: 'git@github.com:bestyled/berun.git',
          TITLE: '@berun/runner-fuse-box',
          VERSION: expect.any(String),
          WORKSPACE: '/Volumes/DATA/projects/berun'
        }
      ],
      name: 'Env'
    },
    {
      args: [],
      name: 'SVG'
    },
    {
      args: [],
      name: 'CSS'
    },
    {
      args: [],
      name: 'JSON'
    },
    {
      args: [
        {
          templateString: `Test1`,
          path: '/'
        }
      ],
      name: 'WebIndex'
    },
    {
      args: {
        config: {
          ast: true,
          babelrc: false,
          presets: ['@berun/babel-preset-react-app'],
          highlightCode: true,
          compact: false
        },
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
        limit2project: true
      },
      name: 'Babel'
    }
  ])
})
