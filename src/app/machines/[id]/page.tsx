'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { subscribeMachines, subscribeToSensorData, updateMachine } from '@/lib/machines'
import Navbar from '@/components/Navbar'
import SensorChart from '@/components/SensorChart'
import AIPanel from '@/components/AIPanel'
import type { Machine, SensorReading } from '@/types'
import { MATERIAL_OPTIMAL, formatTimestamp, getStatusColor } from '@/lib/utils'
import { ArrowLeft, Thermometer, Gauge, Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'

const MATERIALS = ['PP', 'PE', 'ABS', 'PVC', 'PS', 'PET', 'Nylon']

function MetricCard({ label, value, unit, min, max, icon }: {
  label: string; value: number; unit: string; min: number; max: number; icon: React.ReactNode
}) {
  const pct = Math.min(100, Math.max(0, ((value - 0) / (max * 1.3)) * 100))
  const inRange = value >= min && value <= max
  const color = inRange ? 'text-green-400' : value > max ? 'text-red-400' : 'text-yellow-400'
  const barColor = inRange ? 'bg-green-500' : value > max ? 'bg-red-500' : 'bg-yellow-500'

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3 text-white/40">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-3xl font-bold mb-1 ${color}`}>
        {value}<span className="text-base font-normal ml-1">{unit}</span>
      </div>
      <p className="text-white/30 text-xs mb-3">Rango óptimo: {min}–{max}{unit}</p>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function MachineDetailPage() {
  const params = useParams()
  const machineId = params.id as string
  const { user, loading } = useAuth()
  const router = useRouter()

  const [machine, setMachine] = useState<Machine | null>(null)
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [editMaterial, setEditMaterial] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const unsub = subscribeMachines(user.uid, (machines) => {
      const m = machines.find((m) => m.id === machineId)
      if (m) setMachine(m)
    })
    return unsub
  }, [user, machineId])

  useEffect(() => {
    const unsub = subscribeToSensorData(machineId, setReadings)
    return unsub
  }, [machineId])

  if (loading || !user || !machine) return null

  const latest = readings[readings.length - 1]
  const optimal = MATERIAL_OPTIMAL[machine.material || 'PP'] || MATERIAL_OPTIMAL['PP']

  const changeMaterial = async (m: string) => {
    await updateMachine(machineId, { material: m })
    setEditMaterial(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Link href="/machines" className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{machine.name}</h1>
              <span className={`flex items-center gap-1.5 text-xs font-medium ${getStatusColor(machine.status)}`}>
                <span className={`status-dot ${machine.status === 'online' ? 'bg-green-400 animate-pulse' : machine.status === 'alert' ? 'bg-red-400 animate-pulse' : 'bg-gray-500'}`} />
                {machine.status === 'online' ? 'En línea' : machine.status === 'alert' ? 'Alerta' : 'Desconectada'}
              </span>
            </div>
            {machine.description && <p className="text-white/40 text-sm mt-0.5">{machine.description}</p>}
          </div>

          {/* Material selector */}
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-sm">Material:</span>
            {editMaterial ? (
              <select
                className="input-field py-1.5 text-sm w-auto"
                value={machine.material || 'PP'}
                onChange={(e) => changeMaterial(e.target.value)}
                onBlur={() => setEditMaterial(false)}
                autoFocus
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m} className="bg-gray-900">{m}</option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => setEditMaterial(true)}
                className="bg-brand-600/15 text-brand-300 border border-brand-600/30 hover:border-brand-400/50 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                {machine.material || 'PP'} ✎
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — metrics + charts */}
          <div className="lg:col-span-2 space-y-6">

            {/* Live readings */}
            {latest ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <MetricCard
                  label="Temperatura"
                  value={latest.temperature}
                  unit="°C"
                  min={optimal.temp[0]}
                  max={optimal.temp[1]}
                  icon={<Thermometer className="w-4 h-4" />}
                />
                <MetricCard
                  label="Presión"
                  value={latest.pressure}
                  unit=" bar"
                  min={optimal.pressure[0]}
                  max={optimal.pressure[1]}
                  icon={<Gauge className="w-4 h-4" />}
                />
              </div>
            ) : (
              <div className="card text-center py-12">
                <WifiOff className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <h3 className="text-white/50 font-medium mb-1">Esperando datos del sensor</h3>
                <p className="text-white/30 text-sm">
                  Asegúrate de que el Raspberry Pi (<span className="font-mono">{machine.raspberryId || 'sin ID'}</span>) esté conectado y ejecutando el script.
                </p>
              </div>
            )}

            {/* Charts */}
            {readings.length > 1 && (
              <div className="card space-y-6">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-400" />
                  <h3 className="font-semibold text-white">Historial en tiempo real</h3>
                  <span className="ml-auto text-xs text-white/30">Últimas {readings.length} lecturas</span>
                </div>
                <SensorChart
                  readings={readings}
                  type="temperature"
                  optimalMin={optimal.temp[0]}
                  optimalMax={optimal.temp[1]}
                />
                <div className="border-t border-white/5" />
                <SensorChart
                  readings={readings}
                  type="pressure"
                  optimalMin={optimal.pressure[0]}
                  optimalMax={optimal.pressure[1]}
                />
              </div>
            )}

            {/* Latest readings table */}
            {readings.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Últimas lecturas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                        <th className="pb-2 text-left">Hora</th>
                        <th className="pb-2 text-right">Temperatura</th>
                        <th className="pb-2 text-right">Presión</th>
                        <th className="pb-2 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[...readings].reverse().slice(0, 10).map((r, i) => {
                        const tOk = r.temperature >= optimal.temp[0] && r.temperature <= optimal.temp[1]
                        const pOk = r.pressure >= optimal.pressure[0] && r.pressure <= optimal.pressure[1]
                        const ok = tOk && pOk
                        return (
                          <tr key={i} className="text-white/60">
                            <td className="py-2 font-mono text-xs">{formatTimestamp(r.timestamp)}</td>
                            <td className={`py-2 text-right font-medium ${tOk ? '' : 'text-red-400'}`}>{r.temperature}°C</td>
                            <td className={`py-2 text-right font-medium ${pOk ? '' : 'text-yellow-400'}`}>{r.pressure} bar</td>
                            <td className="py-2 text-right">
                              {ok
                                ? <CheckCircle className="w-3.5 h-3.5 text-green-400 ml-auto" />
                                : <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 ml-auto" />}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right — AI panel + info */}
          <div className="space-y-5">
            <AIPanel machine={machine} latestReading={latest} />

            {/* Raspberry info */}
            <div className="card space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Wifi className="w-4 h-4 text-brand-400" /> Conexión Raspberry Pi
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/40">ID del dispositivo</span>
                  <span className="font-mono text-white/70 text-xs">{machine.raspberryId || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Ruta Firebase</span>
                  <span className="font-mono text-white/50 text-xs">machines/{machine.raspberryId || '<id>'}/readings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Intervalo</span>
                  <span className="text-white/70">1 segundo</span>
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300">
                Ejecuta el script <span className="font-mono">raspberry_pi/sensor_reader.py</span> en el dispositivo para enviar datos.
              </div>
            </div>

            {/* Optimal range reference */}
            <div className="card">
              <h3 className="font-semibold text-white mb-3">Rangos óptimos — {machine.material || 'PP'}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5" />Temperatura</span>
                  <span className="text-white/70">{optimal.temp[0]}–{optimal.temp[1]}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" />Presión</span>
                  <span className="text-white/70">{optimal.pressure[0]}–{optimal.pressure[1]} bar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
