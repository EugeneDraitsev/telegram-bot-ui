import React, { useState } from 'react'
import { sumBy, take } from 'lodash-es'

import { Tabs } from '../tabs.component'
import { DailyUsersBars, DailyUsersPie } from '../graphs'
import { GraphCard, Header, SubTitle, Title } from './chat.styles'
import { DailyUserData } from '../../types'

interface LastDayStatisticsProps {
  usersData: DailyUserData[]
}

export const WeeklyChatStatistics = ({ usersData }: LastDayStatisticsProps) => {
  const [tab, setTab] = useState(0)

  return (
    <GraphCard>
      <Header>
        <Title>
          Weekly chat statistics
          <SubTitle>All messages: {sumBy(usersData, 'messages')}</SubTitle>
        </Title>
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
