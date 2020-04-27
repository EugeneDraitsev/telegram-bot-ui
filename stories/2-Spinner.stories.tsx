import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { text, number } from '@storybook/addon-knobs'

import { Spinner } from '../src/components'

export default {
  title: 'Spinners',
}

export const Spinners = () => {
  const radius = number('radius', 100)
  const color = text('color', 'green')
  return (
    <>
      <Spinner />
      <Spinner style={{ marginLeft: 20 }} size={105} />
      <Spinner style={{ marginLeft: 20 }} color="red" />
      <Spinner style={{ marginLeft: 20 }} size={radius} color={color} />
    </>
  )
}
