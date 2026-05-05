'use client'

import { useState } from 'react'
import { Brain, Zap, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import type { SensorReading, Machine } from '@/types'
import { MATERIAL_OPTIMAL } from '@/lib/utils'

interface Props {
  machine: Machine
  latestReading?: SensorReading
}

interface Recommendation {
  status: 'ok' | 'warning' | 'critical'
  reasoning: string
  actions: string[]
  predictedFault?: string
}

function analyzeLocally(machine: Machine, reading: SensorReading): Recommendation {
  const material = machine.material || 'PP'
  const optimal = MATERIAL_OPTIMAL[material] || MATERIAL_OPTIMAL['PP']
  const [tMin, tMax] = optimal.temp
  const [pMin, pMax] = optimal.pressure

  const actions: string[] = []
  let status: 'ok' | 'warning' | 'critical' = 'ok'
  let predictedFault: string | undefined

  if (reading.temperature > tMax + 20) {
    status = 'critical'
    actions.push(`Reducir temperatura de ${reading.temperature}°C a ${tMax}°C (óptimo para ${material})`)
    predictedFault = 'Degradación del material por sobrecalentamiento — riesgo de scrap elevado'
  } else if (reading.temperature > tMax) {
    status = 'warning'
    actions.push(`Bajar temperatura: ${reading.temperature}°C → objetivo ${tMax}°C`)
  } else if (reading.temperature < tMin - 10) {
    status = 'critical'
    actions.push(`Aumentar temperatura de ${reading.temperature}°C a ${tMin}°C para fluidez correcta`)
    predictedFault = 'Inyección incompleta — alta probabilidad de scrap por baja temperatura'
  } else if (reading.temperature < tMin) {
    status = 'warning'
    actions.push(`Subir temperatura: ${reading.temperature}°C → objetivo ${tMin}°C`)
  }

  if (reading.pressure > pMax + 200) {
    if (status !== 'critical') status = 'critical'
    actions.push(`Reducir presión de ${reading.pressure} bar a ${pMax} bar — riesgo de daño al molde`)
    predictedFault = predictedFault || 'Sobrepresión — posible daño al molde o deformación de pieza'
  } else if (reading.pressure > pMax) {
    if (status === 'ok') status = 'warning'
    actions.push(`Reducir presión: ${reading.pressure} bar → ${pMax} bar`)
  } else if (reading.pressure < pMin) {
    if (status === 'ok') status = 'warning'
    actions.push(`Aumentar presión: ${reading.pressure} bar → ${pMin} bar`)
  }

  if (actions.length === 0) {
    actions.push('Todos los parámetros dentro del rango óptimo. Continúa operando normalmente.')
  }

  const reasoning =
    status === 'ok'
      ? `La máquina opera correctamente para material ${material}. Temperatura ${reading.temperature}°C y presión ${reading.pressure} bar dentro del rango [${tMin}-${tMax}°C / ${pMin}-${pMax} bar].`
      : `Se detectaron parámetros fuera del rango óptimo para ${material} (T: ${tMin}-${tMax}°C, P: ${pMin}-${pMax} bar). Temperatura actual: ${reading.temperature}°C, Presión: ${reading.pressure} bar.`

  return { status, reasoning, actions, predictedFault }
}

export default function AIPanel({ machine, latestReading }: Props) {
  const [result, setResult] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!latestReading) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setResult(analyzeLocally(machine, latestReading))
    setLoading(false)
  }

  const statusIcon = {
    ok: <CheckCircle className="w-4 h-4 text-green-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    critical: <AlertTriangle className="w-4 h-4 text-red-400" />,
  }

  const statusColor = {
    ok: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    critical: 'border-red-500/30 bg-red-500/5',
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-brand-400" />
        <h3 className="font-semibold text-white">IA Agéntica</h3>
        <span className="ml-auto text-xs bg-brand-600/20 text-brand-300 border border-brand-600/30 px-2 py-0.5 rounded-full">
          {machine.material || 'PP'}
        </span>
      </div>

      {!latestReading ? (
        <p className="text-white/40 text-sm">Esperando datos del sensor para poder analizar...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Temperatura actual</p>
              <p className="text-white font-semibold">{latestReading.temperature}°C</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Presión actual</p>
              <p className="text-white font-semibold">{latestReading.pressure} bar</p>
            </div>
          </div>

          <button
            onClick={analyze}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analizando...</>
            ) : (
              <><Zap className="w-4 h-4" /> Analizar y Optimizar</>
            )}
          </button>
        </>
      )}

      {result && (
        <div className={`rounded-lg border p-4 space-y-3 ${statusColor[result.status]}`}>
          <div className="flex items-center gap-2">
            {statusIcon[result.status]}
            <span className="text-sm font-medium text-white">
              {result.status === 'ok' ? 'Operación óptima' : result.status === 'warning' ? 'Ajuste recomendado' : 'Acción inmediata requerida'}
            </span>
          </div>

          <p className="text-white/60 text-xs leading-relaxed">{result.reasoning}</p>

          {result.predictedFault && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
              <p className="text-red-300 text-xs font-medium">Falla predicha: {result.predictedFault}</p>
            </div>
          )}

          <div className="space-y-1.5">
            {result.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-brand-400 mt-0.5">→</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
