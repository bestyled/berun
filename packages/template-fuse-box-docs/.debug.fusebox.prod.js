module.exports = {
  homeDir: '/Volumes/DATA/projects/berun',
  sourceMaps: {
    project: true,
    vendor: false
  },
  output:
    '/Volumes/DATA/projects/berun/packages/template-fuse-box-docs/build-static/$name.js',
  target: 'browser@es2016',
  hash: false,
  cache: true,
  useTypescriptCompiler: true,
  debug: true,
  ensureTsConfig: false,
  allowSyntheticDefaultImports: true,
  alias: {
    '@bestatic/config':
      '~/packages/template-fuse-box-docs/config/bestatic.config.js'
  },
  plugins: [
    {
      env: {
        APP_PATH:
          '/Volumes/DATA/projects/berun/packages/template-fuse-box-docs',
        WORKSPACE: '/Volumes/DATA/projects/berun',
        PUBLIC_URL: '',
        REMOTE_ORIGIN_URL: 'git@github.com:bestyled/berun.git',
        TITLE: '@berun/template-fuse-box-docs',
        VERSION: '0.1.24',
        DIRECTORIES: {},
        NODE_ENV: 'development',
        FuseBox: true
      }
    },
    {
      test: /\.svg$/
    },
    {
      test: /\.css$/,
      minify: false,
      options: {}
    },
    {
      test: /\.json$/
    },
    {
      opts: {
        templateString:
          '<!DOCTYPE html>\n    <html>\n      <head>\n        <meta charset=\'utf-8\'>\n        <title>BeRun App</title>\n        <style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>\n      </head>\n      <body>\n      <div id="root"></div>\n       $bundles\n</body>\n    </html>',
        path: '/'
      }
    },
    [
      {
        test: /\.(md|mdx)$/
      },
      {
        test: /\.(md|mdx)$/,
        options: {
          mdPlugins: [
            function() {
              /* omitted long function */
            },
            function() {
              /* omitted long function */
            },
            function() {
              /* omitted long function */
            },
            function slug() {
              return transformer
            },
            function() {
              /* omitted long function */
            }
          ],
          hastPlugins: []
        }
      },
      {
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
        test: /\.js|\.jsx|\.mjs|\.ts|\.tsx|\.md|\.mdx$/,
        limit2project: true,
        config: {
          babelrc: false,
          highlightCode: true,
          compact: false,
          presets: ['@berun/babel-preset-react-app'],
          ast: true
        },
        configPrinted: false,
        configLoaded: false
      }
    ]
  ]
}
