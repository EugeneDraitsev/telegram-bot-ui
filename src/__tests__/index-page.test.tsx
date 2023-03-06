import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { FetchMock } from '@react-mock/fetch'

import Index from '../app/page'
import { ThemeProvider } from '@/contexts'
import { CONFIG } from '@/constants'

describe('Index Page', () => {
  it('shows correct text', () => {
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
    render(
      <FetchMock
        mocks={[
          {
            matcher: `${CONFIG.rest}/search?name=test`,
            response: [
              { id: -1, title: 'Test Chat', description: 'Test Description' },
            ],
          },
        ]}
      >
        <ThemeProvider>
          <Index />
        </ThemeProvider>
      </FetchMock>,
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
  })
})
