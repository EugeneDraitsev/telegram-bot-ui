import React from 'react'
import App from 'next/app'

import { ThemeProvider } from '../contexts'

export default class extends App {
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
