import React from 'react'
import styled from 'styled-components'
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { HistoricalData } from '../../types'
import { tint } from 'polished'
import { map } from 'lodash-es'

const Wrapper = styled.div`
  padding: 10px;
  height: 900px;
`

const getBarColor = (i: number, length: number) => tint(i / (length * 1.3), '#4A90E2')

type HistoricalBarsProps = {
  data: HistoricalData []
}

export const HistoricalBars = ({ data }: HistoricalBarsProps) => (
  <ResponsiveContainer height={500}>
    <BarChart data={data} layout="horizontal" margin={{ right: 15, left: 15 }}>
      <Bar dataKey="msgCount">
        {map(data, (d, i: number) => (
          <Cell key={i} fill={getBarColor(i, data.length)} />
        ))}
      </Bar>
      <XAxis dataKey="username" />
      <YAxis dataKey="msgCount" />
    </BarChart>
  </ResponsiveContainer>
)
