import React, { useState } from 'react'
import styled from 'styled-components'
import { orderBy, round, sumBy } from 'lodash-es'

import { Tabs } from '../tabs.component'
import { GraphCard, Header, SubTitle, Title } from './chat.styles'
import { HistoricalData as HistoricalDataType } from '../../types'
import { HistoricalBars } from '../graphs/historical-bars.component'

interface HistoricalStatisticsProps {
  historicalData: HistoricalDataType[]
}

const UserValues = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin: 0 10px;
`
const HistoricalData = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100%;
  min-height: 400px;
  padding-left: 10px;
`

export const HistoricalStatistics = ({ historicalData }: HistoricalStatisticsProps) => {
  const [tab, setTab] = useState(0)
  const allMessagesCount = sumBy(historicalData, 'msgCount')

  return (
    <GraphCard>
      <Header>
        <Title>
          Users Historical Data
          <SubTitle>All messages: {allMessagesCount.toLocaleString()}</SubTitle>
        </Title>
        <Tabs
          tabs={['Table', 'Barchart']}
          selectedIndex={tab}
          onTabClick={(index) => setTab(index)}
        />
      </Header>
      {tab === 0 && (
        <HistoricalData>
          {orderBy(historicalData, 'msgCount', 'desc').map((user) => (
            <React.Fragment key={user?.id}>
              <UserValues>{user?.username}</UserValues>
              <UserValues>
                {user?.msgCount.toLocaleString()} (
                {round((user?.msgCount / allMessagesCount) * 100, 2)}%)
              </UserValues>
            </React.Fragment>
          ))}
        </HistoricalData>
      )}
      {tab === 1 && <HistoricalBars data={orderBy(historicalData, 'msgCount', 'desc')} />}
    </GraphCard>
  )
}
