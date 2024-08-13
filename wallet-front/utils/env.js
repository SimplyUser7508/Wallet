// tiny wrapper with default env vars
module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 6002,
};
