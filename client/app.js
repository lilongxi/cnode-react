// 客户端入口文件
import React from 'react'
import { AppContainer } from 'react-hot-loader' //eslint-disable-line
import ReactDom from 'react-dom'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import AppState from './store/app.state'

const root = document.getElementById('root')
// 获取全局初始state，从服务端注入
const initialState = window.__INITAL_STATE__ || {}

const render = (Component) => {
  const renderMethod = ReactDom.hydrate
  renderMethod(
    <AppContainer>
      <Provider appState={new AppState(initialState)}>
        <BrowserRouter>
          <Component/>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    render(App)
    const NextApp = require('./App.jsx').default //eslint-disable-line
    render(NextApp)
  })
}

