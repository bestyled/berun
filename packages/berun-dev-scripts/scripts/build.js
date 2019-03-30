'use strict';
const path = require('path');
const chalk = require('chalk');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('cross-spawn');

const argv = process.argv.slice(3);

argv.push(
   '-p',  path.join(process.cwd(), 'tsconfig.dist.json')
);

argv.push(
  '--pretty'
);

const cmd = path.join(path.dirname(require.resolve('typescript')), '../../.bin/tsc');
console.log(`${chalk.cyan('$')} ${chalk.blue('tsc')} ${argv.join(" ")}`);

const result = spawn.sync(
  cmd,
  argv,
  { stdio: ['ignore', 'pipe', 'inherit'], cwd: process.cwd() }
);

if (result.stdout) console.log(result.stdout.toString());

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    );
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    );
  }
  process.exit(1);
}
process.exit(result.status);