#!/usr/bin/env node
/* eslint-disable */
// Strips inherited Next.js parent-process env vars that would otherwise hijack
// our next.config.ts (e.g. __NEXT_PRIVATE_STANDALONE_CONFIG forces a hardcoded
// config from a parent Next runtime, breaking generateBuildId / PWA setup).
const POISON = [
  '__NEXT_PRIVATE_STANDALONE_CONFIG',
  '__NEXT_PRIVATE_ORIGIN',
  'NEXT_DEPLOYMENT_ID',
  'NODE_ENV',
];
for (const k of POISON) delete process.env[k];

const cmd = process.argv[2];
if (cmd === 'build' || cmd === 'start') process.env.NODE_ENV = 'production';
else if (cmd === 'dev') process.env.NODE_ENV = 'development';

const { spawn } = require('child_process');
const args = process.argv.slice(2);
const child = spawn(
  process.platform === 'win32' ? 'next.cmd' : 'next',
  args,
  { stdio: 'inherit', env: process.env },
);
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
