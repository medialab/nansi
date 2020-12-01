const DefinePlugin = require('webpack').DefinePlugin;

const NANSI_BASE_URL = process.env.NANSI_BASE_URL || '/';
const PROD = process.env.NODE_ENV === 'production';

const config = {
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader'
        }
      }
    ]
  },
  plugins: [new DefinePlugin({NANSI_BASE_URL: JSON.stringify(NANSI_BASE_URL)})]
};

if (PROD) config.output = {publicPath: NANSI_BASE_URL};

module.exports = config;
