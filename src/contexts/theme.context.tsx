import { ThemeProvider as StyledProvider } from 'styled-components'
import { tint } from 'polished'
import type { ReactNode } from 'react'

import GlobalStyles from '@/styles/global.styles'
import type { Theme } from '@/types'

const colors = {
  primary: '#4A90E2',
  background: '#fafafa',
  active: tint(0.3, '#4A90E2'),
  activeText: '#fafafa',
  inactive: '#7d7d7d',
  inactiveText: '#2f2d2d',
}

const theme: Theme = { colors }

interface ThemeProviderProps {
  children?: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <StyledProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledProvider>
  )
}

export { ThemeProvider }
