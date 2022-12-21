/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      snarkyjs: require('path').resolve('node_modules/snarkyjs'),
    }
    config.experiments.topLevelAwait = true;
    config.optimization.minimizer = [];
    return config;
  },
  // To enable SnarkyJS for the web, we must set the COOP and COEP headers.
  // See here for more information: https://docs.minaprotocol.com/zkapps/how-to-write-a-zkapp-ui#enabling-coop-and-coep-headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if your project has type errors.
    // needed because of broken typescript top-level await checking
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/zkapp-nonogram' : undefined, // update if your repo name changes for 'npm run deploy' to work successfully
  assetPrefix: process.env.NODE_ENV === 'production' ? '/zkapp-nonogram/' : undefined, // update if your repo name changes for 'npm run deploy' to work successfully
};

module.exports = nextConfig
