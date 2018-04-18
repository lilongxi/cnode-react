import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import TopicList from '../views/topic-list/index.js'
import TopicDetail from '../views/topic-detail/index.js'
import TopicTest from '../views/test/api.test'

export default () => [
  <Route key="0" path='/' exact={true} render={() => <Redirect push={true} to='/list' />} />,
  <Route key="1" path='/list' component={TopicList} />,
  <Route key="2" path='/detail' component={TopicDetail} />,
  <Route key="3" path='/test' component={TopicTest} />,
]
