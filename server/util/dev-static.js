
const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const ReactSSR = require('react-dom/server')
const path = require('path')
const proxy = require('http-proxy-middleware')
const asyncBootstrap = require('react-async-bootstrapper')

const serverConfig = require('../../build/webpack.config.server')
const http = 'http://localhost:8888'

const getTemplate = () => {
  // 请求8888下的html
  return new Promise((resolve, reject) => {
    axios.get(`${http}/public/index.html`)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => reject(err))
  })
}

// 根据构造器返回
const Moudle = module.constructor

// 实时读取webpack打包结果
const serverCompiler = webpack(serverConfig)
const mfs = new memoryFs()
let serverBundle, createStoreMap
// 指定webpack输出到内存中，不在硬盘中生层dist目录
serverCompiler.outputFileSystem = mfs
// watch webpack的每一次编译
serverCompiler.watch({}, (err, status) => {
  if (err) throw new Error(err)
  status = status.toJson()
  status.errors.forEach(err => console.error(err))
  status.warnings.forEach(warn => console.warn(warn))
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Moudle()
  m._compile(bundle, 'server-entry.js')
  // 获取serverentery中的渲染服务端模板函数,并导出
  serverBundle = m.exports.default
  // 获取store
  createStoreMap = m.exports.createStoreMap
})

module.exports = function (app) {
  // 现在的请求是3333，把3333下的请求文件代理到8888端口下
  app.use('/public', proxy({
    target: http
  }))

  // 从缓存中获取模板
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const routerContext = {}
      const appBundle = serverBundle(createStoreMap(), routerContext, req.url)

      asyncBootstrap(appBundle).then(() => {
        const appString = ReactSSR.renderToString(appBundle)
        // 判断路由重定向, 在渲染过后
        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const tmp = template.replace('<!-- app -->', appString)
        res.send(tmp)
      })
    })
  })
}
