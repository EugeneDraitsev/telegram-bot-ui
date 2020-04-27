import React from 'react'
import { GitHub } from 'react-feather'
import styled from 'styled-components'
// eslint-disable-next-line import/no-extraneous-dependencies
import { text } from '@storybook/addon-knobs'

import { Input } from '../src/components'

export default {
  title: 'Input',
}

const Story = styled.div`
  > div {
    margin: 10px 0;
  }
`

export const SimpleInput = () => {
  const value = text('value', 'Simple input')
  return (
    <>
      <Input value={value} />
    </>
  )
}

export const IconInput = () => {
  const valueIcon = text('valueIcon', 'Simple input')
  const valueEmoji = text('valueEmoji', 'Emoji 🦄')
  const valueCurrency = text('valueCurrency', '123,43')

  return (
    <Story>
      <div><Input icon={<GitHub />} value={valueIcon} /></div>
      <div><Input icon="🐈" value={valueEmoji} /></div>
      <div><Input icon="$" iconPadding={20} value={valueCurrency} style={{ width: 215 }} /></div>
    </Story>
  )
}
