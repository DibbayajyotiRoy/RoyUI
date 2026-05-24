import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@royui/ui'],
  serverExternalPackages: ['shiki'],
};

export default config;
