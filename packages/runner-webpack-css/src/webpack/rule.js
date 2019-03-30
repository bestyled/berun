const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

// common function to get style loaders
const getStyleLoaders = (options, cssOptions, preProcessor) => {
  const loaders = { use: {} }

  if (options.ISPRODUCTION) {
    loaders.use['minicss'] = { loader: MiniCssExtractPlugin.loader }
  } else loaders.use['style'] = { loader: require.resolve('style-loader') }

  loaders.use['css'] = {
    loader: require.resolve('css-loader'),
    options: cssOptions
  }
  loaders.use['post-css'] = {
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          flexbox: 'no-2009'
        })
      ],
      sourceMap: options.ISPRODUCTION ? shouldUseSourceMap : false
    }
  }

  if (preProcessor) {
    loaders.use['pre-css'] = { loader: require.resolve(preProcessor) }
  }

  return loaders
}

/**
 *  "postcss" loader applies autoprefixer to our CSS.
 * "css" loader resolves paths in CSS and adds assets as dependencies.
 * "style" loader turns CSS into JS modules that inject <style> tags.
 * In production, we use a plugin to extract that CSS to a file, but
 * in development "style" loader enables hot editing of CSS.
 * By default we support CSS Modules with the extension .module.css
 */
module.exports.ruleMainPostCss = (berun, options) => {
  berun.webpack.module
    .rule('main')
    .oneOf('post-css')
    .test(cssRegex)
    .exclude.add(cssModuleRegex)
    .end()
    .merge(
      getStyleLoaders(options, {
        sourceMap: options.ISPRODUCTION ? shouldUseSourceMap : false,
        importLoaders: 1
      })
    )
}

// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
// using the extension .module.css
module.exports.ruleMainCssModule = (berun, options) => {
  berun.webpack.module
    .rule('main')
    .oneOf('css-module')
    .test(cssModuleRegex)
    .merge(
      getStyleLoaders(options, {
        importLoaders: 1,
        modules: true,
        sourceMap: options.ISPRODUCTION ? shouldUseSourceMap : false,
        getLocalIdent: getCSSModuleLocalIdent
      })
    )
}

/**
 *  Opt-in support for SASS (using .scss or .sass extensions).
 * Chains the sass-loader with the css-loader and the style-loader
 * to immediately apply all styles to the DOM.
 * By default we support SASS Modules with the
 * extensions .module.scss or .module.sass
 */
module.exports.ruleMainSass = (berun, options) => {
  berun.webpack.module
    .rule('main')
    .oneOf('sass')
    .test(sassRegex)
    .exclude.add(sassModuleRegex)
    .end()
    .merge(
      getStyleLoaders(
        options,
        {
          importLoaders: 2,
          sourceMap: options.ISPRODUCTION ? shouldUseSourceMap : false
        },
        'sass-loader'
      )
    )
}

/**
 *  Adds support for CSS Modules, but using SASS
 * using the extension .module.scss or .module.sass
 */
module.exports.ruleMainSassModule = (berun, options) => {
  berun.webpack.module
    .rule('main')
    .oneOf('sass-module')
    .test(sassModuleRegex)
    .merge(
      getStyleLoaders(
        options,
        {
          importLoaders: 2,
          sourceMap: options.ISPRODUCTION ? shouldUseSourceMap : false,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent
        },
        'sass-loader'
      )
    )
}
