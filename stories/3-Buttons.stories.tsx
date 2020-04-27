import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { boolean } from '@storybook/addon-knobs'

import { Button } from '../src/components'

export default {
  title: 'Buttons',
}

export const Buttons = () => {
  const isLoading = boolean('loading', true)
  return (
    <>
      <Button style={{ marginRight: 10 }}>Default</Button>
      <Button style={{ marginRight: 10 }} disabled>Disabled</Button>
      <Button style={{ marginRight: 10 }} loading={isLoading}>Loading</Button>
    </>
  )
}
