'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import styled from 'styled-components'

import { Tabs } from '@/components/tabs.component'
import type { MessageCountRange, MessageCounts } from '@/types'
import { GraphCard, Header, SubTitle, Title } from './chat.styles'
import { ChartPlaceholder } from './statistics-skeleton.component'

const MessageVolumeBars = dynamic(
  () =>
    import('../graphs/message-volume-bars.component').then(
      (module) => module.MessageVolumeBars,
    ),
  { ssr: false, loading: ChartPlaceholder },
)

const RANGES: MessageCountRange[] = ['day', 'week', 'month', 'year']
const TAB_LABELS = ['Day', 'Week', 'Month', 'Year']
const RANGE_CAPTIONS: Record<MessageCountRange, string> = {
  day: 'Last 24 hours, by hour',
  week: 'Last 7 days, by day',
  month: 'Last 30 days, by day',
  year: 'Last 12 months, by month',
}

// Same footprint as the chart, so losing the counts does not resize the card.
const Unavailable = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  padding: 0 20px;
  color: #8791a0;
  font-size: 13px;
  text-align: center;
`

interface MessageVolumeProps {
  messageCounts?: MessageCounts
}

export const MessageVolume = ({ messageCounts }: MessageVolumeProps) => {
  const [tab, setTab] = useState(0)
  const range = RANGES[tab]
  // Absent counts mean the backend could not read them, which is not the same
  // as a quiet chat: a real zero arrives as buckets that are all zero. Showing
  // "0 messages" for a failed read would be a lie, and a visible one next to a
  // card that did load.
  const points = messageCounts?.[range]
  const total = points?.reduce((sum, point) => sum + point.count, 0) ?? 0

  return (
    <GraphCard>
      <Header>
        <Title>
          Messages over time
          <SubTitle>
            {RANGE_CAPTIONS[range]}
            {points ? ` · ${total.toLocaleString()} messages` : ''}
          </SubTitle>
        </Title>
        <Tabs
          tabs={TAB_LABELS}
          selectedIndex={tab}
          onTabClick={(index) => setTab(index)}
        />
      </Header>
      {points ? (
        <MessageVolumeBars data={points} range={range} />
      ) : (
        <Unavailable role="status">
          Data unavailable. Message counts could not be read for this chat —
          the rest of this page is unaffected.
        </Unavailable>
      )}
    </GraphCard>
  )
}
