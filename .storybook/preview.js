import React from 'react'
import styled from 'styled-components'
import { addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import { ThemeProvider } from '../src/contexts'

const StoriesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 100%;
  background-color: transparent;
`

const StyledDecorator = (story) => (
  <ThemeProvider>
    <StoriesWrapper>
      {story()}
    </StoriesWrapper>
  </ThemeProvider>
)

addDecorator(StyledDecorator)
addDecorator(withKnobs)
