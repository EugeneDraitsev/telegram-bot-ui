import React from 'react'
import { ThemeProvider as StyledProvider } from 'styled-components'
import { tint } from 'polished'

import GlobalStyles from '../styles/global.styles'
import { Theme } from '../types'

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

const ThemeContext = React.createContext({} as ThemeState)

interface ThemeProviderProps {
  children?: React.ReactChild
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
