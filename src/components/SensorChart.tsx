'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import type { SensorReading } from '@/types'
import { formatTimestamp } from '@/lib/utils'

interface Props {
  readings: SensorReading[]
  type: 'temperature' | 'pressure'
  optimalMin?: number
  optimalMax?: number
}

const config = {
  temperature: {
    label: 'Temperatura',
    unit: '°C',
    color: '#f97316',
    domain: [0, 400] as [number, number],
  },
  pressure: {
    label: 'Presión',
    unit: ' bar',
    color: '#29a3f5',
    domain: [0, 2000] as [number, number],
  },
}

export default function SensorChart({ readings, type, optimalMin, optimalMax }: Props) {
  const { label, unit, color, domain } = config[type]

  const data = readings.map((r) => ({
    time: formatTimestamp(r.timestamp),
    value: type === 'temperature' ? r.temperature : r.pressure,
  }))

  return (
    <div>
      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">{label}</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={domain}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f1929',
              border: '1px solid rgba(41,163,245,0.2)',
              borderRadius: '8px',
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}${unit}`, label]}
            labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
          />
          {optimalMin && <ReferenceLine y={optimalMin} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 4" />}
          {optimalMax && <ReferenceLine y={optimalMax} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 4" />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
