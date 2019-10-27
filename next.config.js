// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')

module.exports = withTM({
  transpileModules: ['lodash-es'],
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://s3.amazonaws.com/telegram-bot-ui-static' : '',
  // devIndicators: {
  //   autoPrerender: false,
  // },
})
