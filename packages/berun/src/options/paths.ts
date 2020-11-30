import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url'
import * as remoteOriginUrlModule from 'remote-origin-url'
import { findMonorepo, isMonoRoot } from './utils/workspaceUtils'

let exported: {
  appBuild: string
  appHtml: string
  appIndexJs: string
  appNodeModules: string
  appPublic: string
  appPackageJson: any
  appPath: string
  appSrc: string
  appTSConfig: string
  config: string
  configEnv: string
  homepage: string
  isTypeScript: boolean
  publicPath: string
  publicUrl: string
  remoteOriginUrl: string
  servedPath: string
  srcPaths: string[]
  testsSetup: string
  useYarn: boolean
  workspace: string
  metaWorkspace: string
  ownPath: string
} = {} as any

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const envPublicUrl = process.env.PUBLIC_URL

exported.isTypeScript = fs.existsSync(resolveApp('tsconfig.json'))
const hasProdTypeScript = fs.existsSync(resolveApp('tsconfig.prod.json'))
const hasLocalConfig =
  fs.existsSync(resolveApp('config/berun.config.ts')) ||
  fs.existsSync(resolveApp('config/berun.config.js'))

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/')
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1)
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`
  }
  return inputPath
}

const getPublicUrl = (appPackageJson) =>
  // eslint-disable-next-line
  envPublicUrl || require(appPackageJson).homepage || "http://localhost:3000"

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

function getFile(file, extensions) {
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(file + extensions[i])) {
      return file + extensions[i]
    }
  }

  return file + extensions[0]
}
const isMono = isMonoRoot(appDirectory)

if (isMono.isMonoRoot) {
  exported.appSrc = resolveApp(isMono.workspaces[0].split('/')[0])
} else {
  exported.appSrc = resolveApp('src')
}

exported.srcPaths = [exported.appSrc]
exported.appPath = resolveApp('.')
exported.appPackageJson = resolveApp('package.json')
exported.workspace = path.dirname(exported.appPackageJson)
exported.metaWorkspace = path.dirname(exported.appPackageJson)
exported.useYarn = fs.existsSync(path.join(exported.appPath, 'yarn.lock'))

// if app is in a monorepo (lerna or yarn workspace), treat other packages in
// the monorepo as if they are app source
const mono = findMonorepo(appDirectory)
if (mono.isAppIncluded) {
  Array.prototype.push.apply(exported.srcPaths, mono.pkgs)
  exported.workspace = path.dirname(mono.monoPkgPath)

  // if mono repo is itself in a meta repository, set the metaWorkspace variable
  if (fs.existsSync(path.resolve(exported.workspace, '..', '.meta'))) {
     exported.metaWorkspace = path.resolve(exported.workspace, '..')
  } else {    
    exported.metaWorkspace = exported.workspace
  }
}
exported.useYarn = exported.useYarn || mono.isYarnWs

const getRemoteOriginUrl = (_) => {
  const rootPath = path.resolve(
    exported.workspace || exported.appPath,
    '.git/config'
  )
  let result
  const appPackageJsonContents = require(exported.appPackageJson)

  if (
    appPackageJsonContents.repository &&
    appPackageJsonContents.repository.url &&
    appPackageJsonContents.repository.type === 'git'
  ) {
    result = appPackageJsonContents.repository.url
  } else {
    result = remoteOriginUrlModule.sync(rootPath)
  }
  return result
}

// config after eject: we're in ./config/
exported = {
  ...exported,
  ownPath: path.resolve(__dirname, '..'),
  configEnv: getFile(resolveApp('config/env.config'), ['.js', '.ts', '.json']),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: getFile(resolveApp('src/index'), ['.js', '.jsx', '.ts', '.tsx']),
  testsSetup: getFile(resolveApp('src/setupTests'), ['.js', '.ts']),
  appNodeModules: resolveApp('node_modules'),
  homepage: getPublicUrl(resolveApp('package.json')),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  config: hasLocalConfig
    ? getFile(resolveApp('config/berun.config'), ['.ts', '.js'])
    : require.resolve('../../config/berun.config.default.ts'),
  remoteOriginUrl: getRemoteOriginUrl(resolveApp('package.json')),
}

if (exported.isTypeScript) {
  exported.appTSConfig = hasProdTypeScript
    ? resolveApp('tsconfig.prod.json')
    : resolveApp('tsconfig.json')
}

if (process.env.NODE_ENV !== 'production') {
  exported.publicPath = '/'
  exported.publicUrl = ''
} else {
  exported.publicPath = exported.servedPath
}

export const {
  appBuild,
  appHtml,
  appIndexJs,
  appNodeModules,
  appPublic,
  appPackageJson,
  appPath,
  appSrc,
  appTSConfig,
  config,
  configEnv,
  homepage,
  isTypeScript,
  publicPath,
  publicUrl,
  remoteOriginUrl,
  servedPath,
  srcPaths,
  testsSetup,
  useYarn,
  workspace,
  metaWorkspace,
  ownPath,
} = exported
