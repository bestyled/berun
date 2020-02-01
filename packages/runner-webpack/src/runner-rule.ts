import Berun from '@berun/berun'

import 'babel-loader'
import '@svgr/webpack'
import 'url-loader'
import 'file-loader'

/**
 *  Disable require.ensure as it's not a standard language feature.
 */
export const ruleParser = (berun: Berun, _) => {
  berun.webpack.module
    .rule('parser')
    .parser({ requireEnsure: false })
    .end()
}

/**
 * `mjs` support is still in its infancy in the ecosystem, so we don't
 * support it.
 * Modules who define their `browser` or `module` key as `mjs` force
 * the use of this extension, so we need to tell webpack to fall back
 * to auto mode (ES Module interop, allows ESM to import CommonJS).
 */
export const ruleMjs = (berun: Berun, _) => {
  berun.webpack.module
    .rule('mjs')
    .test([/\.mjs$/])
    .include.add(/node_modules/)
    .end()
    .type('javascript/auto')
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        require.resolve('@berun/babel-preset-react-app/dist/dependencies')
      ],
      cacheDirectory: true,
      cacheCompression: process.env.NODE_ENV === 'production',
      highlightCode: true,
      sourceMaps: false
    })
}

/**
 * "url" loader works like "file" loader except that it embeds assets
 * smaller than specified limit in bytes as data URLs to avoid requests.
 * A missing `test` is equivalent to a match.
 */
export const ruleMainImage = (berun: Berun, _) => {
  berun.webpack.module
    .rule('main')
    .oneOf('image')
    .test([/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/])
    .exclude.add(/node_modules/)
    .end()
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({ limit: 10000, name: 'static/media/[name].[hash:8].[ext]' })
}

/**
 * Process application JS with Babel.
 * The preset includes JSX, Flow, and some ESnext features.
 */
export const ruleMainCompile = (berun: Berun, _) => {
  berun.webpack.module
    .rule('main')
    .oneOf('compile')
    .test(/\.(js|jsx|ts|tsx)$/)
    .include.merge([berun.options.paths.workspace])
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      /* placeholder */
    })
}

/**
 * "file" loader makes sure those assets get served by WebpackDevServer.
 * When you `import` an asset, you get its (virtual) filename.
 * In production, they would get copied to the `build` folder.
 * This loader doesn't use a "test" so it will catch all modules
 * that fall through the other loaders.
 */
export const ruleMainStatic = (berun: Berun, _) => {
  berun.webpack.module
    .rule('main')
    .oneOf('static')
    // Exclude `js` files to keep "css" loader working as it injects
    // its runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    .exclude.add(/\.(css|scss|sass|js|jsx|mjs|ts|tsx)$/)
    .add(/\.ejs$/)
    .add(/\.html$/)
    .add(/\.json$/)
    .add(/node_modules/)
    .end()
    .use('file')
    .loader(require.resolve('file-loader'))
    .options({
      name: 'static/media/[name].[hash:8].[ext]'
    })
}

export const ruleMainSvg = (berun: Berun, _) => {
  berun.webpack.module
    .rule('main')
    .oneOf('svg')
    .test(/\.svg$/)
    .exclude.add(/node_modules/)
    .end()
    .use('svgr')
    .loader(require.resolve('@svgr/webpack'))
    .end()
    .use('svgr')
    .loader(require.resolve('url-loader'))
}
