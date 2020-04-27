// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')(['lodash-es'])

module.exports = withTM({
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    AWS_ACCESS_KEY_ID: process.env.KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.ACCESS_KEY,
    test: 'test',
    test2: process.env.AwsAccessKey,
  },
})
