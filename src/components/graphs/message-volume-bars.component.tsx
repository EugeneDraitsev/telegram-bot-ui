'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { tint } from 'polished'

import type { MessageCountPoint, MessageCountRange } from '@/types'

// Buckets are UTC instants; formatting them in the app's display zone keeps the
// label pointing at the same moment without shifting a bucket into another day.
const ZONE = 'Europe/Stockholm'

const AXIS_FORMATS: Record<MessageCountRange, Intl.DateTimeFormatOptions> = {
  day: { hour: '2-digit', minute: '2-digit' },
  week: { weekday: 'short' },
  month: { day: 'numeric', month: 'short' },
  year: { month: 'short' },
}

const TOOLTIP_FORMATS: Record<MessageCountRange, Intl.DateTimeFormatOptions> = {
  day: { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' },
  week: { weekday: 'long', day: 'numeric', month: 'short' },
  month: { day: 'numeric', month: 'short' },
  year: { month: 'long', year: 'numeric' },
}

const format = (value: number, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { ...options, timeZone: ZONE }).format(value)

interface MessageVolumeBarsProps {
  data: MessageCountPoint[]
  range: MessageCountRange
}

export const MessageVolumeBars = ({ data, range }: MessageVolumeBarsProps) => (
  <ResponsiveContainer height={400}>
    <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
      <CartesianGrid stroke="#eef1f4" vertical={false} />
      <Bar dataKey="count" minPointSize={1} radius={[2, 2, 0, 0]}>
        {data.map((point, index) => (
          <Cell key={point.t} fill={tint(index / (data.length * 1.3), '#4A90E2')} />
        ))}
      </Bar>
      <XAxis
        dataKey="t"
        tick={{ fontSize: 11 }}
        tickLine={false}
        axisLine={{ stroke: '#d8dee5' }}
        interval="preserveStartEnd"
        minTickGap={12}
        tickFormatter={(value: number) => format(value, AXIS_FORMATS[range])}
      />
      <YAxis
        allowDecimals={false}
        tick={{ fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        width={44}
      />
      <Tooltip
        cursor={{ fill: 'rgba(74, 144, 226, 0.08)' }}
        labelStyle={{ fontSize: 12, lineHeight: '12px', marginBottom: 8 }}
        itemStyle={{ fontSize: 12, lineHeight: '12px' }}
        wrapperStyle={{ opacity: 0.95 }}
        labelFormatter={(label) =>
          typeof label === 'number' ? format(label, TOOLTIP_FORMATS[range]) : ''
        }
        formatter={(value) => [
          typeof value === 'number' ? value.toLocaleString() : value,
          'Messages',
        ]}
      />
    </BarChart>
  </ResponsiveContainer>
)
