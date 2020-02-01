import { create as berunJs } from '@berun/berun'
import presetReact from '../src'

test('Gets Fusebox plugin configuration', () => {
  const berun = berunJs(presetReact)
  berun.fusebox.toConfig() // call toConfig to set babel plugin

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
          APP_PATH:
            '/Volumes/DATA/projects/berun/packages/preset-fuse-box-react',
          DIRECTORIES: {},
          PUBLIC_URL: '',
          REMOTE_ORIGIN_URL: 'git@github.com:bestyled/berun.git',
          TITLE: '@berun/preset-fuse-box-react',
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
    }
  ])
})
