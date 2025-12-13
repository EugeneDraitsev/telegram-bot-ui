import React from 'react'
import styled from 'styled-components'
import { definePreview } from '@storybook/nextjs-vite'

import { ThemeProvider } from '@/contexts'
import '../src/app/global.css'

const StoriesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 100%;
  background-color: transparent;
`

export default definePreview({
  parameters: {
    backgrounds: {},
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <StoriesWrapper>
          <Story />
        </StoriesWrapper>
      </ThemeProvider>
    ),
  ],
})
