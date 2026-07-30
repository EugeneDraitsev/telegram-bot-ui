import React from 'react'
import { render, screen } from '@testing-library/react'

import Index from '../app/page'
import { ThemeProvider } from '@/contexts'

describe('Index Page', () => {
  beforeEach(() => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>,
    )
  })

  it('shows the correct text', () => {
    expect(
      screen.queryByText("Hi, I'm a Telegram chat bot."),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Add the bot to your chat/i),
    ).toBeInTheDocument()
  })

  it('does not expose public chat search', () => {
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText(/private statistics link/i)).toBeInTheDocument()
  })
})
