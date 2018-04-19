import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { resolve } from 'path';
// react服务端渲染标签seo
import Helmet from 'react-helmet'

@inject('appState')
@observer
export default class TopicList extends Component {
  componentDidMount() {
    // do
    console.log(this.props)
  }

  // 数据初始化asyncBootstrap
  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 200
        resolve(true)
      })
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>this is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        {this.props.appState.msg}!!!
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.object,
}
