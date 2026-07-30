'use client'

import dynamic from 'next/dynamic'
import React, { useState } from 'react'

import { Tabs } from '@/components/tabs.component'
import { GraphCard, Header, SubTitle, Title } from './chat.styles'
import type { DailyUserData } from '@/types'

const DailyUsersBars = dynamic(
  () =>
    import('../graphs/daily-users-bars.component').then(
      (module) => module.DailyUsersBars,
    ),
  { ssr: false },
)
const DailyUsersPie = dynamic(
  () =>
    import('../graphs/daily-users-pie.component').then(
      (module) => module.DailyUsersPie,
    ),
  { ssr: false },
)

interface LastDayStatisticsProps {
  usersData: DailyUserData[]
}

export const LastDayStatistics = ({ usersData }: LastDayStatisticsProps) => {
  const [tab, setTab] = useState(0)
  const topUsers = usersData.slice(0, 10)
  const allMessagesCount = usersData.reduce(
    (total, user) => total + user.messages,
    0,
  )

  return (
    <GraphCard>
      <Header>
        <Title>
          Last 24h chat users statistics (Top 10 users)
          <SubTitle>All messages: {allMessagesCount}</SubTitle>
        </Title>
        <Tabs
          tabs={['Barchart', 'Piechart']}
          selectedIndex={tab}
          onTabClick={(index) => setTab(index)}
        />
      </Header>
      {tab === 0 && <DailyUsersBars data={topUsers} />}
      {tab === 1 && <DailyUsersPie data={topUsers} />}
    </GraphCard>
  )
}
