const DefinePlugin = require('webpack').DefinePlugin;

const NANSI_BASE_URL = process.env.NANSI_BASE_URL || '/';

module.exports = {
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            publicPath: NANSI_BASE_URL
          }
        }
      }
    ]
  },
  plugins: [new DefinePlugin({NANSI_BASE_URL: JSON.stringify(NANSI_BASE_URL)})]
};
