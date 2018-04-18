import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'

@inject('appState')
@observer
export default class TopicList extends Component {
  componentDidMount() {
    // do
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
