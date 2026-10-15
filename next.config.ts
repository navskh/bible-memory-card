import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';
import { execFileSync } from 'node:child_process';

const getCommitSha = () => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA;
  }

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'local';
  }
};

const nextConfig: NextConfig = {
  env: {
    APP_COMMIT_SHA: getCommitSha(),
  },
};

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    skipWaiting: true,
  },
});

export default withPWA(nextConfig);
