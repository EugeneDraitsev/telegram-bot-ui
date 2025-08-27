import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'

import Index from '../app/page'
import { ThemeProvider } from '@/contexts'

describe('Index Page', () => {
  it('shows the correct text', () => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>,
    )

    expect(
      screen.queryByText("Hi, I'm a Telegram chat bot."),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/If you have already added the bot to your chat/i),
    ).toBeInTheDocument()
  })

  it('should properly handle search', async () => {
    // Comments are in English as requested
    const mockPayload = [
      { id: -1, title: 'Test Chat', description: 'Test Description' },
    ]

    // Save original fetch to restore later
    const originalFetch = globalThis.fetch
    globalThis.fetch = jest.fn().mockResolvedValue(mockPayload)

    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>,
    )

    const input = screen.getByLabelText('chat-name')
    expect(input).toBeInTheDocument()

    const searchButton = screen.getByText('Search')
    expect(searchButton).toBeInTheDocument()

    act(() => {
      fireEvent.change(input, { target: { value: 'test' } })
      fireEvent.click(searchButton)
    })

    await waitFor(() => {
      expect(screen.queryByLabelText('spinner')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByText('Test Chat')).not.toBeInTheDocument()
    })

    globalThis.fetch = originalFetch
  })
})
