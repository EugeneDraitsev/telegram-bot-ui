import React, { memo, PropsWithChildren } from 'react'
import { ThemeProvider as StyledProvider } from 'styled-components'

import GlobalStyles from '../styles/global.styles'
import { Theme } from '../types'

const colors = {
  primary: '#4A90E2',
  background: '#fafafa',
  inactive: '#7d7d7d',
}

type ThemeState = {
  theme: Theme
}

const ThemeContext = React.createContext({} as ThemeState)

const ThemeProvider = memo(({ children }: PropsWithChildren<{}>) => {
  const theme = { colors }

  return (
    <ThemeContext.Provider value={{ theme }}>
      <GlobalStyles />
      <StyledProvider theme={theme}>
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  )
})

export { ThemeContext, ThemeProvider }
