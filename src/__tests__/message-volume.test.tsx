import { fireEvent, render, screen } from '@testing-library/react'

import { ThemeProvider } from '../contexts'
import type { MessageCounts } from '@/types'

const { MessageVolume } = await import(
  '../components/chat/message-volume.component'
)

// The last bucket is the current, partial one, exactly as the backend sends it.
const series = (length: number, count: number, step: number) =>
  Array.from({ length }, (_, index) => ({
    t: Date.UTC(2026, 7, 20) - (length - 1 - index) * step,
    count,
  }))

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const messageCounts: MessageCounts = {
  day: series(24, 5, HOUR),
  week: series(7, 100, DAY),
  month: series(30, 10, DAY),
  year: series(12, 1000, 30 * DAY),
}

const renderVolume = (counts?: MessageCounts) =>
  render(
    <ThemeProvider>
      <MessageVolume messageCounts={counts} />
    </ThemeProvider>,
  )

describe('message volume card', () => {
  test('opens on the day range and totals its buckets', () => {
    renderVolume(messageCounts)

    expect(screen.getByText(/Last 24 hours, by hour/)).toBeInTheDocument()
    expect(screen.getByText(/120 messages/)).toBeInTheDocument()
  })

  test.each([
    ['Week', 'Last 7 days, by day', '700 messages'],
    ['Month', 'Last 30 days, by day', '300 messages'],
    ['Year', 'Last 12 months, by month', '12,000 messages'],
  ])('switches to %s', (tab, caption, total) => {
    renderVolume(messageCounts)

    fireEvent.click(screen.getByRole('tab', { name: tab }))

    expect(screen.getByText(new RegExp(caption))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(total))).toBeInTheDocument()
  })

  test('ends on the current bucket rather than the previous one', () => {
    const last = messageCounts.year[messageCounts.year.length - 1]

    expect(last.t).toBe(Date.UTC(2026, 7, 20))
  })

  test('says the counts are unavailable rather than claiming zero', () => {
    renderVolume(undefined)

    expect(screen.getByText(/Data unavailable/)).toBeInTheDocument()
    expect(screen.queryByText(/0 messages/)).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Day' })).toBeInTheDocument()
  })

  test('still reports a genuinely quiet chat as zero', () => {
    renderVolume({
      day: series(24, 0, HOUR),
      week: series(7, 0, DAY),
      month: series(30, 0, DAY),
      year: series(12, 0, 30 * DAY),
    })

    expect(screen.getByText(/0 messages/)).toBeInTheDocument()
    expect(screen.queryByText(/Data unavailable/)).not.toBeInTheDocument()
  })
})
