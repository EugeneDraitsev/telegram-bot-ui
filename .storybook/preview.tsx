import styled from 'styled-components'
import type { Preview, Decorator } from '@storybook/react'

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

// We need to duplicate it for storyshots plugin
export const decorators: Decorator[] = [
  (Story) => (
    <ThemeProvider>
      <StoriesWrapper>
        <Story />
      </StoriesWrapper>
    </ThemeProvider>
  ),
]

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <StoriesWrapper>
          <Story />
        </StoriesWrapper>
      </ThemeProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'light',
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
