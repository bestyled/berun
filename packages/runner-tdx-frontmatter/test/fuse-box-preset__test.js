import { presetReact } from '@berun/preset-fuse-box-react'
const berun_js = require('@berun/berun')
import { presetTdx } from '@berun/runner-tdx'
import { presetTdxFrontMatter } from '../src'

test('Gets FuseBox core configuration', async () => {
  const berun = berun_js(presetReact)
    .use(presetTdx)
    .use(presetTdxFrontMatter)

  expect(berun.fusebox.get('homeDir')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-tdx-frontmatter/src'
  )
  expect(berun.fusebox.get('sourceMaps')).toEqual({
    project: true,
    vendor: false
  })
  expect(berun.fusebox.get('hash')).toEqual(false)
  expect(berun.fusebox.get('cache')).toEqual(true)
  expect(berun.fusebox.get('output')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-tdx-frontmatter/build/$name.js'
  )
  expect(berun.fusebox.get('target')).toEqual('browser@es2016')

  // HACK to wait 1s to allow Fusebox enough time to tear down
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})

test('Gets Fusebox plugin configuration', () => {
  const berun = berun_js(presetReact)
    .use(presetTdx)
    .use(presetTdxFrontMatter)
  const _ = berun.fusebox.toConfig() // call toConfig to set babel plugin

  expect(
    berun.fusebox.plugins.values().map(plugin => {
      const c = plugin.toConfig()
      if ('__pluginName' in c) {
        return {
          name: c.__pluginName,
          args: c.__pluginArgs || []
        }
      } else {
        return c.map(ic => {
          return {
            name: ic.__pluginName,
            args: ic.__pluginArgs || []
          }
        })
      }
    })
  ).toEqual([
    {
      args: [
        {
          APP_PATH:
            '/Volumes/DATA/projects/berun/packages/runner-tdx-frontmatter',
          NODE_ENV: 'test',
          WORKSPACE: '/Volumes/DATA/projects/berun',
          FuseBox: true,
          APP_PATH:
            '/Volumes/DATA/projects/berun/packages/runner-tdx-frontmatter',
          DIRECTORIES: {},
          PUBLIC_URL: '',
          REMOTE_ORIGIN_URL: 'git@github.com:bestyled/berun.git',
          TITLE: '@berun/runner-tdx-frontmatter',
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
          templateString: expect.stringContaining('<!DOCTYPE html>'),
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
    },
    [
      {
        args: [],
        name: 'FrontMatter'
      },
      {
        args: { mdPlugins: expect.any(Array), hastPlugins: expect.any(Array) },
        name: 'TDX'
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
          extensions: [
            '.js',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.md',
            '.mdx',
            '.tdx'
          ],
          limit2project: true
        },
        name: 'Babel'
      }
    ]
  ])
})
