'use client'

import React from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { tint } from 'polished'
import { map } from 'lodash-es'

import type { HistoricalData } from '@/types'

const getBarColor = (i: number, length: number) =>
  tint(i / (length * 1.3), '#4A90E2')

type HistoricalBarsProps = {
  data: HistoricalData[]
}

export const HistoricalBars = ({ data }: HistoricalBarsProps) => (
  <ResponsiveContainer height={Math.max(data.length * 30, 400)}>
    <BarChart
      data={data}
      layout="vertical"
      margin={{ right: 15, left: 55 }}
      barSize={30}
    >
      <Bar dataKey="msgCount" minPointSize={2}>
        {map(data, (d, i: number) => (
          <Cell key={i} fill={getBarColor(i, data.length)} />
        ))}
      </Bar>
      <XAxis
        dataKey="msgCount"
        type="number"
        tick={{ fontSize: 12, color: '#000' }}
        axisLine={{ stroke: '#000' }}
      />
      <YAxis
        dataKey="username"
        type="category"
        tick={{ fontSize: 12, color: '#000' }}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip
        cursor={false}
        labelStyle={{ fontSize: 12, lineHeight: '12px', marginBottom: 10 }}
        itemStyle={{ fontSize: 12, lineHeight: '12px' }}
        wrapperStyle={{ opacity: 0.9 }}
        formatter={(x: number) => x.toLocaleString() as any}
      />
    </BarChart>
  </ResponsiveContainer>
)
