import React, { Component } from 'react'
import Routes from './config/router'
import { Link } from 'react-router-dom'

class App extends Component {
  componentDidMount() {
    // do
  }
  render() {
    return [
      <div key="link">
        <Link to="/"> 首页</Link>
        <Link to="/detail"> 详情页</Link>
      </div>,
      <Routes key="routers" />,
    ]
  }
}

export default App
