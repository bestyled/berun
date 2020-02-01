import TerserPlugin from 'terser-webpack-plugin'
import Berun from '@berun/berun'

/**
 *  Add Development and Production config to berun.webpack.optimization
 */
export const optimization = (berun: Berun, _) => {
  berun.webpack.optimization
    .splitChunks({ chunks: 'all', name: false })
    .runtimeChunk(true)
}

/**
 *  Add Development and Production config to berun.webpack.optimization
 */
export const terser = (berun: Berun, _) => {
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

  berun.webpack.optimization.minimize(true)

  berun.webpack.optimization.minimizer('terser').use(TerserPlugin, [
    {
      terserOptions: {
        parse: {
          // we want terser to parse ecma 8 code. However, we don't want it
          // to apply any minfication steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false
        },
        mangle: {
          safari10: true
        },
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          // eslint-disable-next-line @typescript-eslint/camelcase
          ascii_only: true
        }
      },
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      // Enable file caching
      cache: true,
      sourceMap: shouldUseSourceMap
    }
  ])
}
