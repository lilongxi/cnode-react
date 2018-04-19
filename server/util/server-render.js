const asyncBootstrapper = require('react-async-bootstrapper')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const ReactSSR = require('react-dom/server')
const Helmet = require('react-helmet').default

// 获取stores
const getStoreState = stores => {
  return Object.keys(stores).reduce((result, storeName) => {
    return result[storeName] = stores[storeName].toJson()
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {

    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const appBundle = createApp(stores, routerContext, req.url)

    asyncBootstrapper(appBundle).then(() => {
      // 判断路由重定向, 在渲染过后
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }

      // 重新获取初始化后的state，然后渲染
      const state = getStoreState(stores)
      // seo
      const helmet = Helmet.rewind()

      const appString = ReactSSR.renderToString(appBundle)
      // 通过html渲染
      // const tmp = template.replace('<!-- app -->', appString)
      // 通过ejs渲染
      const tmp = ejs.render(template, {
        appString: appString,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString()
      })
      res.send(tmp)
      resolve()
    })
    .catch(err => {
        reject(err)
    })
  })
}
