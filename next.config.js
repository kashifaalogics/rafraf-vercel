const { withFrameworkConfig } = require('./framework/common/config');

const frameworkName = 'magento'; // ✅ define separately

module.exports = withFrameworkConfig(frameworkName, {
  images: {
    domains: ['rafraf.com', 's3.me-south-1.amazonaws.com'],
  },
  reactStrictMode: true,
  experimental: {
    streaming: true,
    staticPageGenerationTimeout: 120,
  },
  env: {
    NODE_OPTIONS: '--max-old-space-size=4096',
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 100000,
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    };
    return config;
  },
});
