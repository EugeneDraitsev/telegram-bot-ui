import React, { useState } from 'react'
import { take } from 'lodash-es'

import { Tabs } from '../tabs.component'
import { DailyUsersBars, DailyUsersPie } from '../graphs'
import { GraphCard, Header, Title } from './chat.styles'
import { DailyUserData } from '../../types'

interface LastDayStatisticsProps {
  usersData: DailyUserData[]
}

export const LastDayStatistics = ({ usersData }: LastDayStatisticsProps) => {
  const [tab, setTab] = useState(0)

  return (
    <GraphCard>
      <Header>
        <Title>Last 24h chat users statistics (Top 10 users)</Title>
        <Tabs
          tabs={['Barchart', 'Piechart']}
          selectedIndex={tab}
          onTabClick={(index) => setTab(index)}
        />
      </Header>
      {tab === 0 && <DailyUsersBars data={take(usersData, 10)} />}
      {tab === 1 && <DailyUsersPie data={take(usersData, 10)} />}
    </GraphCard>
  )
}
