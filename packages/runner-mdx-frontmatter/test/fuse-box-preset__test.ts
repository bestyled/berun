import { create as berunJs } from '@berun/berun'
import presetReact from '@berun/preset-fuse-box-react'
import presetMdx from '@berun/runner-mdx'
import presetMdxFrontMatter from '../src'

test('Gets FuseBox core configuration', async () => {
  const berun = berunJs(presetReact)
    .use(presetMdx)
    .use(presetMdxFrontMatter)

  expect(berun.fusebox.get('homeDir')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-mdx-frontmatter/src'
  )
  expect(berun.fusebox.get('sourceMaps')).toEqual({
    project: true,
    vendor: false
  })
  expect(berun.fusebox.get('hash')).toEqual(false)
  expect(berun.fusebox.get('cache')).toEqual(true)
  expect(berun.fusebox.get('output')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-mdx-frontmatter/build/$name.js'
  )
  expect(berun.fusebox.get('target')).toEqual('browser@es2018')

  // HACK to wait 1s to allow Fusebox enough time to tear down
  await new Promise((resolve, _) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})

test('Gets Fusebox plugin configuration', () => {
  const berun = berunJs(presetReact)
    .use(presetMdx)
    .use(presetMdxFrontMatter)

  berun.fusebox.toConfig() // call toConfig to set babel plugin

  expect(
    berun.fusebox.plugins.values().map(plugin => {
      const c = plugin.toConfig()
      if ('__pluginName' in c) {
        return {
          name: c.__pluginName,
          args: c.__pluginArgs || []
        }
      }
      return c.map(ic => {
        return {
          name: ic.__pluginName,
          args: ic.__pluginArgs || []
        }
      })
    })
  ).toEqual([
    {
      args: [
        {
          APP_PATH:
            '/Volumes/DATA/projects/berun/packages/runner-mdx-frontmatter',
          NODE_ENV: 'test',
          WORKSPACE: '/Volumes/DATA/projects/berun',
          FuseBox: true,
          DIRECTORIES: {},
          PUBLIC_URL: '',
          REMOTE_ORIGIN_URL: 'git@github.com:bestyled/berun.git',
          TITLE: '@berun/runner-mdx-frontmatter',
          VERSION: expect.any(String)
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
    [
      {
        args: [],
        name: 'FrontMatter'
      },
      {
        args: { mdPlugins: expect.any(Array), hastPlugins: expect.any(Array) },
        name: 'MDX'
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
          extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.md', '.mdx'],
          limit2project: true
        },
        name: 'Babel'
      }
    ]
  ])
})
