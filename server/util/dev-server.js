const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')

//生成compiler
const serverCompiler = webpack(serverConfig)

// console.log(serverCompiler)

module.exports = function (app) {
  app.get('*', function (req, res, next) {
    res.send({
      code: 0,
      success: true
    })
  })
}
