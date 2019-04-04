/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const remoteOriginUrl = require('remote-origin-url');
const findMonorepo = require('./utils/workspaceUtils').findMonorepo;
const isMonoRoot = require('./utils/workspaceUtils').isMonoRoot;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

const isTypeScript = fs.existsSync(resolveApp('tsconfig.json'));
const hasProdTypeScript = fs.existsSync(resolveApp('tsconfig.prod.json'));
const hasLocalConfig = fs.existsSync(resolveApp('config/berun.config.js'));

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

function getFile(file, extensions) {
  for (var i = 0; i < extensions.length; i++) {
    if (fs.existsSync(file + extensions[i]))
      return (file + extensions[i]);
  }

  return (file + extensions[0]);
};
const isMono = isMonoRoot(appDirectory);

if (isMono.isMonoRoot) {
  module.exports.appSrc = resolveApp(isMono.workspaces[0].split('/')[0])
} else {
  module.exports.appSrc = resolveApp('src');
}

module.exports.srcPaths = [module.exports.appSrc];
module.exports.appPath = resolveApp('.');
module.exports.appPackageJson = resolveApp('package.json'),
  module.exports.workspace = path.dirname(module.exports.appPackageJson);

module.exports.useYarn = fs.existsSync(
  path.join(module.exports.appPath, 'yarn.lock')
);


// if app is in a monorepo (lerna or yarn workspace), treat other packages in
// the monorepo as if they are app source
const mono = findMonorepo(appDirectory);
if (mono.isAppIncluded) {
  Array.prototype.push.apply(module.exports.srcPaths, mono.pkgs);
  module.exports.workspace = path.dirname(mono.monoPkgPath);
}
module.exports.useYarn = module.exports.useYarn || mono.isYarnWs;



const getRemoteOriginUrl = appPackageJson => {
  const packageJson = require(appPackageJson);

  let rootPath = path.resolve(module.exports.workspace || module.exports.appPath, '.git/config')
  let result;

  if (packageJson.repository && packageJson.repository.url && packageJson.repository.type === 'git') {
    result = packageJson.repository.url
  } else
    result = remoteOriginUrl.sync(rootPath)

  return result
}


// config after eject: we're in ./config/
module.exports = Object.assign(module.exports, {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: getFile(resolveApp('src/index'), ['.js', '.jsx', '.ts', '.tsx']),
  testsSetup: getFile(resolveApp('src/setupTests'), ['.js', '.ts']),
  appNodeModules: resolveApp('node_modules'),
  homepage: getPublicUrl(resolveApp('package.json')),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  config: hasLocalConfig ? resolveApp('config/berun.config.js') : require.resolve('@berun/scripts/config/berun.config.js'),
  remoteOriginUrl: getRemoteOriginUrl(resolveApp('package.json'))
})


if (isTypeScript)
  module.exports.appTSConfig = hasProdTypeScript ? resolveApp('tsconfig.prod.json') : resolveApp('tsconfig.json');

module.exports.isTypeScript = isTypeScript;


if (process.env.NODE_ENV !== 'production') {
  module.exports.publicPath = '/';
  module.exports.publicUrl = '';
} else {
  module.exports.publicPath = module.exports.servedPath;
  module.exports.publicUrl = module.exports.publicUrl // publicPath.slice(0, -1);
}

