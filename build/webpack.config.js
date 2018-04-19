const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const isDev = process.env.NODE_ENV

const config = webpackMerge(baseConfig, {
  mode: isDev,
  entry: {
    app: path.resolve(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/public/'
  },
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
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

if (isDev === 'development') {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    // host: '0.0.0.0',
    port: '8888',
    contentBase: path.resolve(__dirname, '../dist'),
    hot: true,
    publicPath: '/public/',
    overlay: {
      errors: true
    },
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        secure: false
      }
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
