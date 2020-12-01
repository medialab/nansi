module.exports = {
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader'
        }
      }
    ]
  }
};
