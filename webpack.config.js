const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  target: 'webworker',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'src'),
  },
  mode: 'production',
  resolve: {
    fallback: {
      fs: false,
    },
  },
  plugins: [new NodePolyfillPlugin()],
  performance: {
    hints: false,
  },
};
