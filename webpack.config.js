const path = require('path');
module.exports = {
  target: 'node',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs-module',
  },
};
