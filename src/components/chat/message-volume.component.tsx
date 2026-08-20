'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

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

interface MessageVolumeProps {
  messageCounts?: MessageCounts
}

export const MessageVolume = ({ messageCounts }: MessageVolumeProps) => {
  const [tab, setTab] = useState(0)
  const range = RANGES[tab]
  const points = messageCounts?.[range] ?? []
  const total = points.reduce((sum, point) => sum + point.count, 0)

  return (
    <GraphCard>
      <Header>
        <Title>
          Messages over time
          <SubTitle>
            {RANGE_CAPTIONS[range]} · {total.toLocaleString()} messages
          </SubTitle>
        </Title>
        <Tabs
          tabs={TAB_LABELS}
          selectedIndex={tab}
          onTabClick={(index) => setTab(index)}
        />
      </Header>
      <MessageVolumeBars data={points} range={range} />
    </GraphCard>
  )
}
