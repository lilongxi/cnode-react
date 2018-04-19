// server端入口文件
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './App.jsx'

// 给服务端提供初始的store
export { createStoreMap } from './store/store'

// mobx在服务端渲染的时候不会重复数据变换,静态渲染
/* relative框架，渲染时会导致computed多次计算，重复调用，导致内存溢出 */
useStaticRendering(true)

// {appStore: xxx}

export default (stores, routerContext, url) => (
  <Provider {...stores} >
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)
