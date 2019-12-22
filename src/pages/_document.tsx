import React from 'react'
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import GlobalStyles from '../styles/global.styles'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles((
          <>
            <GlobalStyles />
            <App {...props} />
          </>
        )),
      })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicon.png" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=0"
          />
          <meta name="theme-color" content="#F5F5F7" data-react-helmet="true" />
          <meta property="og:image" content="/preview.png" />
          <meta property="og:url" content="https://telegram-bot-ui.now.sh/" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en" />
          <meta property="og:site_name" content="Telegram Bot Stats" />
          <meta property="og:title" content="Telegram Bot Stats" />
          <meta property="og:description" content="Chat Statistics for the last 24 hours" />
          <meta name="docsearch:version" content="2.0" />
          <meta name="twitter:image" content="/preview.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
