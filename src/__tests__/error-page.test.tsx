import React from 'react'
import { render, screen } from '@testing-library/react'

import ErrorPage from '../pages/_error'
import { ThemeProvider } from '../contexts'

describe('Error Page', () => {
  it('shows 404 error by default', () => {
    render(
      <ThemeProvider>
        <ErrorPage />
      </ThemeProvider>,
    )

    expect(screen.queryByText('Page not found 😿')).toBeInTheDocument()
  })
})
