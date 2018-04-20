const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const path = require('path')
const proxy = require('http-proxy-middleware')

const serverConfig = require('../../build/webpack.config.server')
const http = 'http://localhost:8888'
const serverRender = require('./server-render')

const getTemplate = () => {
  // 请求8888下的html
  return new Promise((resolve, reject) => {
    axios.get(`${http}/public/server.ejs`)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => reject(err))
  })
}

// 根据构造器返回
// const Moudle = module.constructor
// 等同于module.exports, node的原生模块
const NavtiveMoudle = require('module')
const vm = require('vm')

// 获取dependencies
const getModuleFromString = (bundle, filename) => {
  const m = {exports: {}}
  // 包装可执行的js代码 `(function(exports, require, module, __filename, __dirname){...bundle code})`
  const wrapper = NavtiveMoudle.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  // 指定执行环境
  const result = script.runInThisContext()
  // 全局的执行环境
  result.call(m.exports, m.exports, require, m)
  return m
}

// 实时读取webpack打包结果
const serverCompiler = webpack(serverConfig)
const mfs = new memoryFs()
let bundleExport
// 指定webpack输出到内存中，不在硬盘中生层dist目录
serverCompiler.outputFileSystem = mfs
// watch webpack的每一次编译
serverCompiler.watch({}, (err, status) => {
  if (err) throw new Error(err)
  status = status.toJson()
  status.errors.forEach(err => console.error(err))
  status.warnings.forEach(warn => console.warn(warn))
  // 获取热更新路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  // 读取文件
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  // const m = new Moudle()
  // m._compile(bundle, 'server-entry.js')
  // 获取serverentery中的渲染服务端模板函数,并导出
  bundleExport = m.exports
// serverBundle = m.exports.default
// 获取store
// createStoreMap = m.exports.createStoreMap
})

module.exports = function (app) {

  // 现在的请求是3333，把3333下的请求文件代理到8888端口下
  app.use('/public', proxy({
    target: http
  }))

  // 从缓存中获取模板
  app.get('*', function (req, res, next) {
    if (!bundleExport) {
      res.send({
        code: 0,
        msg: 'waiting for compiler bundler!'
      })
    }

    getTemplate().then(template => {
      return serverRender(bundleExport, template, req, res)
    }).catch(next)
  })
}
