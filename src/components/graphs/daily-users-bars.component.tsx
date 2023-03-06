'use client'

import React from 'react'
import styled from 'styled-components'
import { tint } from 'polished'
import {
  BarChart,
  XAxis,
  Bar,
  Cell,
  ResponsiveContainer,
  LabelList,
  Tooltip,
  YAxis,
} from 'recharts'
import { isEmpty, map } from 'lodash-es'

import { getUserName } from '@/utils'
import type { DailyUserData } from '@/types'

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
`
const ChartLabel = styled.text`
  font-weight: bold;
  line-height: 17px;
  font-size: 12px;
`
const EmptyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

const getBarColor = (i: number, length: number) =>
  tint(i / (length * 1.3), '#4A90E2')

interface DailyUsersBarsProps {
  data: DailyUserData[]
}

export const DailyUsersBars = ({ data }: DailyUsersBarsProps) => (
  <ChartWrapper>
    {isEmpty(data) && (
      <EmptyWrapper>You don&apos;t have data for the last 24h</EmptyWrapper>
    )}
    {!isEmpty(data) && (
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
        >
          <Bar
            dataKey="messages"
            maxBarSize={50}
            minPointSize={5}
            fill="#4A90E2"
          >
            {map(data, (d, i: number) => (
              <Cell key={i} fill={getBarColor(i, data.length)} />
            ))}
            <LabelList
              data={{} as any}
              dataKey="messages"
              content={({ x, y, width, value }: any) => (
                <ChartLabel
                  x={x + width / 2}
                  y={y - 5}
                  fill="#333333"
                  textAnchor="middle"
                >
                  {value}
                </ChartLabel>
              )}
            />
          </Bar>
          <Tooltip
            cursor={false}
            labelStyle={{ fontSize: 12, lineHeight: '12px', marginBottom: 10 }}
            itemStyle={{ fontSize: 12, lineHeight: '12px' }}
            wrapperStyle={{ opacity: 0.9 }}
            labelFormatter={(id) => getUserName(data.find((d) => d.id === id)!)}
          />
          <YAxis hide />
          <XAxis
            dataKey="id"
            tickLine={false}
            axisLine={{ stroke: ' #4A4A4A', strokeDasharray: '3 3' }}
            tick={({ x, y, width, payload }): any => (
              <g transform={`translate(${x},${y})`}>
                <text
                  width={width}
                  height="auto"
                  textAnchor="middle"
                  fill="#4a4a4a"
                  fontSize={12}
                >
                  <tspan x={0} y={0} dy={10}>
                    {getUserName(data.find((d) => d.id === payload.value)!)}
                  </tspan>
                </text>
              </g>
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </ChartWrapper>
)
