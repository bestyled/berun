module.exports = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  output: {
    path: '/Volumes/DATA/projects/berun/packages/template-react/build',
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(berun.options.paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/')
  },
  resolve: {
    alias: {
      '@babel/runtime':
        '/Volumes/DATA/projects/berun/node_modules/@babel/runtime',
      'react-native': 'react-native-web'
    },
    extensions: [
      '.ts',
      '.tsx',
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx'
    ],
    modules: ['node_modules'],
    plugins: [
      /* berun.webpack.resolve.plugin('ModuleScope') */
      new ModuleScopePlugin(
        '/Volumes/DATA/projects/berun/packages/template-react/src',
        ['/Volumes/DATA/projects/berun/packages/template-react/package.json']
      ),
      /* berun.webpack.resolve.plugin('pnp1') */
      new PnpWebpackPluginClass()
    ]
  },
  resolveLoader: {
    plugins: [
      /* berun.webpack.resolve.plugin('pnp-resolve') */
      {}
    ]
  },
  module: {
    strictExportPresence: true,
    rules: [
      /* berun.webpack.module.rule('parser') */
      {
        parser: {
          requireEnsure: false
        }
      },
      /* berun.webpack.module.rule('mjs') */
      {
        test: [/\.mjs$/],
        type: 'javascript/auto',
        include: [/node_modules/]
      },
      /* berun.webpack.module.rule('main') */
      {
        oneOf: [
          /* berun.webpack.module.rule('main').oneOf('image') */
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            use: [
              /* berun.webpack.module.rule('main').oneOf('image').use('url-loader') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/url-loader/dist/cjs.js',
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[hash:8].[ext]'
                }
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('compile') */
          {
            test: /\.(js|jsx|ts|tsx)$/,
            include: ['/Volumes/DATA/projects/berun'],
            exclude: [/node_modules/],
            use: [
              /* berun.webpack.module.rule('main').oneOf('compile').use('babel') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
                options: {
                  babelrc: false,
                  highlightCode: true,
                  compact: true,
                  cacheDirectory: true,
                  cacheCompression: true,
                  presets: ['@berun/babel-preset-react-app']
                }
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('external') */
          {
            test: /\.js$/,
            use: [
              /* berun.webpack.module.rule('main').oneOf('external').use('babel') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/babel-loader/lib/index.js',
                options: {
                  babelrc: false,
                  compact: false,
                  presets: [
                    '/Volumes/DATA/projects/berun/packages/babel-preset-react-app/dependencies.js'
                  ],
                  cacheDirectory: true,
                  cacheCompression: true,
                  highlightCode: true
                }
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('svg') */
          {
            test: /\.svg$/,
            use: [
              /* berun.webpack.module.rule('main').oneOf('svg').use('svgr') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/@svgr/webpack/lib/index.js'
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('static') */
          {
            exclude: [
              /\.(css|scss|sass|js|jsx|mjs|ts|tsx)$/,
              /\.ejs$/,
              /\.html$/,
              /\.json$/
            ],
            use: [
              /* berun.webpack.module.rule('main').oneOf('static').use('file') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/file-loader/dist/cjs.js',
                options: {
                  name: 'static/media/[name].[hash:8].[ext]'
                }
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('post-css') */
          {
            test: /\.css$/,
            exclude: [/\.module\.css$/],
            use: [
              /* berun.webpack.module.rule('main').oneOf('post-css').use('minicss') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
              },
              /* berun.webpack.module.rule('main').oneOf('post-css').use('css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: true,
                  importLoaders: 1
                }
              },
              /* berun.webpack.module.rule('main').oneOf('post-css').use('post-css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      flexbox: 'no-2009'
                    })
                  ],
                  sourceMap: true
                }
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('css-module') */
          {
            test: /\.module\.css$/,
            use: [
              /* berun.webpack.module.rule('main').oneOf('css-module').use('minicss') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
              },
              /* berun.webpack.module.rule('main').oneOf('css-module').use('css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
                options: {
                  importLoaders: 1,
                  modules: true,
                  sourceMap: true,
                  getLocalIdent: function getLocalIdent(
                    context,
                    localIdentName,
                    localName,
                    options
                  ) {
                    // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
                    const fileNameOrFolder = context.resourcePath.match(
                      /index\.module\.(css|scss|sass)$/
                    )
                      ? '[folder]'
                      : '[name]'
                    // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
                    const hash = loaderUtils.getHashDigest(
                      context.resourcePath + localName,
                      'md5',
                      'base64',
                      5
                    )
                    // Use loaderUtils to find the file or folder name
                    const className = loaderUtils.interpolateName(
                      context,
                      fileNameOrFolder + '_' + localName + '__' + hash,
                      options
                    )
                    // remove the .module that appears in every classname when based on the file.
                    return className.replace('.module_', '_')
                  }
                }
              },
              /* berun.webpack.module.rule('main').oneOf('css-module').use('post-css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      flexbox: 'no-2009'
                    })
                  ],
                  sourceMap: true
                }
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('sass') */
          {
            test: /\.(scss|sass)$/,
            exclude: [/\.module\.(scss|sass)$/],
            use: [
              /* berun.webpack.module.rule('main').oneOf('sass').use('minicss') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
              },
              /* berun.webpack.module.rule('main').oneOf('sass').use('css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
                options: {
                  importLoaders: 2,
                  sourceMap: true
                }
              },
              /* berun.webpack.module.rule('main').oneOf('sass').use('post-css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      flexbox: 'no-2009'
                    })
                  ],
                  sourceMap: true
                }
              },
              /* berun.webpack.module.rule('main').oneOf('sass').use('pre-css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/sass-loader/lib/loader.js'
              }
            ]
          },
          /* berun.webpack.module.rule('main').oneOf('sass-module') */
          {
            test: /\.module\.(scss|sass)$/,
            use: [
              /* berun.webpack.module.rule('main').oneOf('sass-module').use('minicss') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/mini-css-extract-plugin/dist/loader.js'
              },
              /* berun.webpack.module.rule('main').oneOf('sass-module').use('css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/css-loader/dist/cjs.js',
                options: {
                  importLoaders: 2,
                  sourceMap: true,
                  modules: true,
                  getLocalIdent: function getLocalIdent(
                    context,
                    localIdentName,
                    localName,
                    options
                  ) {
                    // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
                    const fileNameOrFolder = context.resourcePath.match(
                      /index\.module\.(css|scss|sass)$/
                    )
                      ? '[folder]'
                      : '[name]'
                    // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
                    const hash = loaderUtils.getHashDigest(
                      context.resourcePath + localName,
                      'md5',
                      'base64',
                      5
                    )
                    // Use loaderUtils to find the file or folder name
                    const className = loaderUtils.interpolateName(
                      context,
                      fileNameOrFolder + '_' + localName + '__' + hash,
                      options
                    )
                    // remove the .module that appears in every classname when based on the file.
                    return className.replace('.module_', '_')
                  }
                }
              },
              /* berun.webpack.module.rule('main').oneOf('sass-module').use('post-css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/postcss-loader/src/index.js',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      flexbox: 'no-2009'
                    })
                  ],
                  sourceMap: true
                }
              },
              /* berun.webpack.module.rule('main').oneOf('sass-module').use('pre-css') */
              {
                loader:
                  '/Volumes/DATA/projects/berun/node_modules/sass-loader/lib/loader.js'
              }
            ]
          }
        ]
      },
      /* berun.webpack.module.rule('eslint') */
      {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        enforce: 'pre',
        include: ['/Volumes/DATA/projects/berun/packages/template-react/src'],
        exclude: [/node_modules/],
        use: [
          /* berun.webpack.module.rule('eslint').use('eslint') */
          {
            loader:
              '/Volumes/DATA/projects/berun/node_modules/eslint-loader/index.js',
            options: {
              formatter: function formatter(results) {
                let output = '\n'
                let hasErrors = false
                let reportContainsErrorRuleIDs = false

                results.forEach(result => {
                  let messages = result.messages
                  if (messages.length === 0) {
                    return
                  }

                  messages = messages.map(message => {
                    let messageType
                    if (isError(message)) {
                      messageType = 'error'
                      hasErrors = true
                      if (message.ruleId) {
                        reportContainsErrorRuleIDs = true
                      }
                    } else {
                      messageType = 'warn'
                    }

                    let line = message.line || 0
                    if (message.column) {
                      line += ':' + message.column
                    }
                    let position = chalk.bold('Line ' + line + ':')
                    return [
                      '',
                      position,
                      messageType,
                      message.message.replace(/\.$/, ''),
                      chalk.underline(message.ruleId || '')
                    ]
                  })

                  // if there are error messages, we want to show only errors
                  if (hasErrors) {
                    messages = messages.filter(m => m[2] === 'error')
                  }

                  // add color to rule keywords
                  messages.forEach(m => {
                    m[4] =
                      m[2] === 'error' ? chalk.red(m[4]) : chalk.yellow(m[4])
                    m.splice(2, 1)
                  })

                  let outputTable = table(messages, {
                    align: ['l', 'l', 'l'],
                    stringLength(str) {
                      return stripAnsi(str).length
                    }
                  })

                  output += `${outputTable}\n\n`
                })

                if (reportContainsErrorRuleIDs) {
                  // Unlike with warnings, we have to do it here.
                  // We have similar code in react-scripts for warnings,
                  // but warnings can appear in multiple files so we only
                  // print it once at the end. For errors, however, we print
                  // it here because we always show at most one error, and
                  // we can only be sure it's an ESLint error before exiting
                  // this function.
                  output +=
                    'Search for the ' +
                    chalk.underline(chalk.red('keywords')) +
                    ' to learn more about each error.'
                }

                return output
              },
              eslintPath:
                '/Volumes/DATA/projects/berun/node_modules/eslint/lib/api.js',
              baseConfig: {
                extends: [
                  '/Volumes/DATA/projects/berun/node_modules/eslint-config-react-app/index.js'
                ],
                settings: {
                  react: {
                    version: '999.999.999'
                  }
                }
              },
              ignore: false,
              useEslintrc: false,
              rules: {
                noRedeclare: false
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: true,
    minimizer: [
      /* berun.webpack.optimization.minimizer('terser') */
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      }),
      /* berun.webpack.optimization.minimizer('optimizeCSSAssets') */
      new OptimizeCssAssetsWebpackPlugin({
        cssProcessorOptions: {
          parser: function safeParse(css, opts) {
            var input = new Input(css, opts)

            var parser = new SafeParser(input)
            parser.parse()

            return parser.root
          },
          map: {
            inline: false,
            annotation: true
          }
        }
      })
    ]
  },
  plugins: [
    /* berun.webpack.plugin('html') */
    new HtmlWebpackPlugin({
      inject: true,
      template:
        '/Volumes/DATA/projects/berun/packages/template-react/public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    /* berun.webpack.plugin('interpolate-html') */
    new InterpolateHtmlPlugin(
      function() {
        /* omitted long function */
      },
      {
        NODE_ENV: 'production',
        PUBLIC_URL: ''
      }
    ),
    /* berun.webpack.plugin('env') */
    new DefinePlugin({
      'process.env': {
        APP_PATH: '"/Volumes/DATA/projects/berun/packages/template-react"',
        WORKSPACE: '"/Volumes/DATA/projects/berun"',
        PUBLIC_URL: '""',
        REMOTE_ORIGIN_URL: '"git@github.com:bestyled/berun.git"',
        TITLE: '"@berun/template-react"',
        VERSION: '"0.3.1"',
        DIRECTORIES: '{}',
        NODE_ENV: '"production"'
      }
    }),
    /* berun.webpack.plugin('progress-bar') */
    new ProgressBarPlugin({
      width: '24',
      complete: '█',
      incomplete: '\u001b[90m░\u001b[39m'
    }),
    /* berun.webpack.plugin('modulenotfound') */
    new ModuleNotFoundPlugin(
      '/Volumes/DATA/projects/berun/packages/template-react'
    ),
    /* berun.webpack.plugin('workbox') */
    new GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: '/index.html',
      navigateFallbackBlacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/]
    }),
    /* berun.webpack.plugin('moment') */
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
    /* berun.webpack.plugin('manifest') */
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/'
    }),
    /* berun.webpack.plugin('mini-css') */
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    })
  ],
  performance: {
    hints: false
  },
  entry: {
    main: [
      '/Volumes/DATA/projects/berun/packages/runner-web-polyfills/src/polyfills.js',
      '/Volumes/DATA/projects/berun/packages/template-react/src/index.js'
    ]
  }
}
