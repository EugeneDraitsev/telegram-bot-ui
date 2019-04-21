import React from 'react'
import { Route, Switch } from 'react-router-dom'

import ChatContainer from './chat.container'
import ErrorContainer from './error.container'

export default () => (
  <Switch>
    <Route path="/chat/:chatId?" component={ChatContainer} />
    <Route component={ErrorContainer} />
  </Switch>
)
