import React, { memo } from 'react'
import { Helmet } from 'react-helmet'

export default memo(() => (
  <Helmet>
    <title>Telegram Bot Stats</title>
    <meta name="theme-color" content="#F5F5F7" data-react-helmet="true" />
    <meta property="og:image" content="/public/preview.png" />
    <meta data-react-helmet="true" name="og:url" content="https://telegram-bot-ui.surge.sh" />
    <meta data-react-helmet="true" property="og:image:width" content="512" />
    <meta data-react-helmet="true" property="og:image:height" content="512" />
    <meta data-react-helmet="true" property="og:type" content="website" />
    <meta data-react-helmet="true" property="og:locale" content="en" />
    <meta data-react-helmet="true" property="og:site_name" content="Telegram Bot Stats" />
    <meta data-react-helmet="true" name="docsearch:version" content="2.0" />
  </Helmet>
))
