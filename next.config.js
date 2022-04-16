// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')(['lodash-es'])

module.exports = withTM({
  compiler: {
    styledComponents: true,
  },
})
