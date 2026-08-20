'use client'

import dynamic from 'next/dynamic'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Tabs } from '@/components/tabs.component'
import { GraphCard, Header, SubTitle, Title } from './chat.styles'
import { ChartPlaceholder } from './statistics-skeleton.component'
import type { HistoricalData as HistoricalDataType } from '@/types'

const HistoricalBars = dynamic(
  () =>
    import('../graphs/historical-bars.component').then(
      (module) => module.HistoricalBars,
    ),
  { ssr: false, loading: ChartPlaceholder },
)

interface HistoricalStatisticsProps {
  historicalData: HistoricalDataType[]
}

const Wrapper = styled(GraphCard)`
  min-height: 400px;
  justify-content: flex-start;
`
const UserValues = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin: 0 10px;
`
const HistoricalData = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-row-gap: 5px;
  width: 100%;
  padding-left: 10px;
`

export const HistoricalStatistics = ({
  historicalData,
}: HistoricalStatisticsProps) => {
  const [tab, setTab] = useState(0)
  const { allMessagesCount, sortedData } = useMemo(
    () => ({
      allMessagesCount: historicalData.reduce(
        (total, user) => total + user.msgCount,
        0,
      ),
      sortedData: [...historicalData].sort(
        (left, right) => right.msgCount - left.msgCount,
      ),
    }),
    [historicalData],
  )

  return (
    <Wrapper>
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
          {sortedData.map((user) => (
            <React.Fragment key={user?.id}>
              <UserValues>{user?.username}</UserValues>
              <UserValues>
                {user?.msgCount.toLocaleString()} (
                {allMessagesCount > 0
                  ? ((user.msgCount / allMessagesCount) * 100).toFixed(2)
                  : '0.00'}
                %)
              </UserValues>
            </React.Fragment>
          ))}
        </HistoricalData>
      )}
      {tab === 1 && (
        <HistoricalBars data={sortedData} />
      )}
    </Wrapper>
  )
}
