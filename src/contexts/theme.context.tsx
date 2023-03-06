import { createContext } from 'react'
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

type ThemeState = {
  theme: Theme
}

const ThemeContext = createContext({} as ThemeState)

interface ThemeProviderProps {
  children?: ReactNode
}

const TypedStyledProvider = StyledProvider as any

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = { colors }

  return (
    <ThemeContext.Provider value={{ theme }}>
      <GlobalStyles />
      <TypedStyledProvider theme={theme}>{children}</TypedStyledProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
