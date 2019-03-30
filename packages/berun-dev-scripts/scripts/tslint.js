'use strict';
const path = require('path');
const chalk = require('chalk');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('react-dev-utils/crossSpawn');

const argv = process.argv.slice(3);


argv.push(
   '-c', require.resolve('../config/tslint.json'), '-t', 'codeFrame','src/**/*.{js,ts}','test/**/*.ts'
);

const cmd = path.join(path.dirname(require.resolve('tslint')), '../.bin/tslint');
console.log(`${chalk.cyan('$')} ${chalk.blue('tslint')} ${argv.join(" ")}`);

const result = spawn.sync(
  cmd,
  argv,
  { stdio: 'inherit', cwd: process.cwd() }
);
if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The lint failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    );
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The lint failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    );
  }
  process.exit(1);
}
process.exit(result.status);