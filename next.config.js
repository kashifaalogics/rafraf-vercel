const { withFrameworkConfig } = require('./framework/common/config');

const frameworkName = 'magento'; // ✅ define separately

module.exports = withFrameworkConfig(frameworkName, {
  images: {
    domains: ['rafraf.com', 's3.me-south-1.amazonaws.com'],
  },
  reactStrictMode: true,
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
});
