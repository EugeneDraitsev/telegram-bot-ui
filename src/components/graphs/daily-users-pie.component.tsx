import React from 'react'
import styled from 'styled-components'
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'
import { isEmpty } from 'lodash-es'

import { DailyUserData } from '../../types'
import { getUserName } from '../../utils'

const schemeCategory10 = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
]

const ChartWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 400px;
  height: auto;
  @media (max-width: 800px) {
    flex-wrap: wrap;
  }
`
const Legend = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 300px;
  padding: 0 15px;
  @media (max-width: 800px) {
    min-width: auto;
  }
`
const LegendItem = styled.div`
  display: flex;
  margin: 10px 0;
`
const LegendCell = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${(p) => p.color};
`
const LegendText = styled.div`
  font-size: 12px;
  line-height: 14px;
  margin-left: 10px;
`
const EmptyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 400px;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

interface UsersBarChartProps {
  data: DailyUserData[]
}

export const DailyUsersPie = ({ data }: UsersBarChartProps) => (
  <ChartWrapper>
    {isEmpty(data) && <EmptyWrapper>You don&apos;t have data for the last 24h</EmptyWrapper>}
    {!isEmpty(data) && (
      <>
        <ResponsiveContainer height={400}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 10 }}>
            <Pie
              data={data}
              dataKey="messages"
              nameKey="id"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={450}
              endAngle={90}
              fill="#82ca9d"
              animationBegin={0}
              animationDuration={750}
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.id} fill={schemeCategory10[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Legend>
          {data.map((user, index) => (
            <LegendItem key={user.id}>
              <LegendCell color={schemeCategory10[index]} />
              <LegendText>{`${getUserName(user)}  (${user.messages})`}</LegendText>
            </LegendItem>
          ))}
        </Legend>
      </>
    )}
  </ChartWrapper>
)
