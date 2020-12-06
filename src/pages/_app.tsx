import React from 'react'
import App from 'next/app'

import { ThemeProvider } from '../contexts'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <ThemeProvider>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    )
  }
}

export default MyApp
