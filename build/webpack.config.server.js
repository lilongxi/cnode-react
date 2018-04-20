const path = require('path')
const webpack = require('webpack') // eslint-disable-line
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  target: 'node',
  entry: [
    'webpack-hot-middleware/client/server.entry.js',
    path.resolve(__dirname, '../client/server.entry.js')
  ],
  output: {
    filename: 'server.entry.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/public/',
    libraryTarget: 'commonjs2'
  },
  externals: Object.keys(require('../package.json').dependencies),
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.(jsx|js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
})
