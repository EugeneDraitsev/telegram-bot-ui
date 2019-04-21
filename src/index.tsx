import React from 'react'
import { hydrate, render } from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'

import * as serviceWorker from './serviceWorker'
import RootContainer from './containers/root.container'
import { ChatDataProvider } from './contexts'
import GlobalStyles from './styles/global.styles'

const history = createBrowserHistory()

const App = () => (
  <Router history={history}>
    <ChatDataProvider>
      <GlobalStyles />
      <RootContainer />
    </ChatDataProvider>
  </Router>
)

const rootElement = document.getElementById('root')
if (rootElement!.hasChildNodes()) {
  hydrate(<App />, rootElement)
} else {
  render(<App />, rootElement)
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
