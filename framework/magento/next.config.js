module.exports = {
  images: {
    domains: ['rafraf.com', 's3.me-south-1.amazonaws.com'],
  },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000,   // Check for changes every second
      aggregateTimeout: 300,   // delay before rebuilding
    };
    return config;
  }
};
