module.exports = {
  // other valid configs like `images`, `reactStrictMode`, `webpack`, etc.
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};