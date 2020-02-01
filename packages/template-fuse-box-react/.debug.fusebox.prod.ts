export default {
  homeDir: '/Volumes/DATA/projects/berun/packages/template-fuse-box-react/src',
  sourceMaps: {
    project: true,
    vendor: false
  },
  output:
    '/Volumes/DATA/projects/berun/packages/template-fuse-box-react/build/$name.js',
  target: 'browser@es2018',
  hash: false,
  cache: true,
  useTypescriptCompiler: false,
  debug: true,
  ensureTsConfig: false,
  allowSyntheticDefaultImports: true,
  plugins: [
    {
      env: {
        APP_PATH:
          '/Volumes/DATA/projects/berun/packages/template-fuse-box-react',
        WORKSPACE: '/Volumes/DATA/projects/berun',
        PUBLIC_URL: '',
        REMOTE_ORIGIN_URL: 'git@github.com:bestyled/berun.git',
        TITLE: '@berun/template-fuse-box-react',
        VERSION: '0.1.41',
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
          '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n    <meta name="theme-color" content="#000000">\n    <!--\n      manifest.json provides metadata used when your web app is added to the\n      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/\n    -->\n    <link rel="manifest" href="/manifest.json">\n    <link rel="shortcut icon" href="/favicon.ico">\n    <!--\n      Notice the use of  in the tags above.\n      It will be replaced with the URL of the `public` folder during the build.\n      Only files inside the `public` folder can be referenced from the HTML.\n\n      Unlike "/favicon.ico" or "favicon.ico", "/favicon.ico" will\n      work correctly both with client-side routing and a non-root public URL.\n      Learn how to configure a non-root public URL by running `npm run build`.\n    -->\n    <title>BeRun App</title>\n  </head>\n  <body>\n    <noscript>\n      You need to enable JavaScript to run this app.\n    </noscript>\n    <div id="root"></div>\n    <!--\n      This HTML file is a template.\n      If you open it directly in the browser, you will see an empty page.\n\n      You can add webfonts, meta tags, or analytics to this file.\n      The build step will place the bundled scripts into the <body> tag.\n\n      To begin the development, run `npm start` or `yarn start`.\n      To create a production bundle, use `npm run build` or `yarn build`.\n    -->\n   $bundles\n</body>\n</html>\n',
        path: '/'
      }
    },
    {
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
      test: /\.js|\.jsx|\.mjs|\.ts|\.tsx$/,
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
}
