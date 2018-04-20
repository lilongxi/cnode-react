const express = require('express')
// const ReactSSR = require('react-dom/server')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const fs = require('fs')
const path = require('path')
const serverRender = require('./util/server-render')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(favicon(path.join(__dirname, '../bitbug_favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))
//  接口代理
app.use('/api/user', require('./util/server-login'))
app.use('/api', require('./util/proxy'))

if (!isDev) {
  // 如果是生产环境，从编译的dist目录下获取模板
  const serverEntry = require('../dist/server.entry')
  // 不是开发环境，存在页面
  // 同步获取页面
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf-8')
  // 通过public来判断是否由服务端返回
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next)
    // const appString = ReactSSR.renderToString(serverEntry)
    // const tmp = template.replace('<!-- app -->', appString)
    // res.send(tmp)
  })
} else {
  // 开发环境，从缓存中读取
  // require('./util/dev-static')(app)
  require('./util/dev-server')(app)
}

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send(error)
})

app.listen(3333, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info('listen to 3333')
  }
})
