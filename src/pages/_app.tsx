import React from 'react'
import App from 'next/app'
import Head from 'next/head'

import { ThemeProvider } from '../contexts'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <ThemeProvider>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    )
  }
}

export default MyApp
