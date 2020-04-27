// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')(['lodash-es'])

module.exports = withTM({
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    AWS_ACCESS_KEY_ID: process.env.AwsAccessKey,
    AWS_SECRET_ACCESS_KEY: process.env.AwsSecretAccessKey,
  },
})
