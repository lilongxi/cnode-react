import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { resolve } from 'path';

@inject('appState')
@observer
export default class TopicList extends Component {
  componentDidMount() {
    // do
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 200
        resolve(true)
      })
    })
  }

  render() {
    return (
      <div>{this.props.appState.msg}!!!</div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.object,
}
