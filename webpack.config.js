const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './doc',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'doc'),
    clean: true,
  },
};
