'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { subscribeMachines } from '@/lib/machines'
import Navbar from '@/components/Navbar'
import type { Machine } from '@/types'
import { Activity, Cpu, AlertTriangle, CheckCircle, WifiOff, Plus, ArrowRight, Gauge, Thermometer } from 'lucide-react'
import { getStatusColor, getStatusBg } from '@/lib/utils'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [machines, setMachines] = useState<Machine[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const unsub = subscribeMachines(user.uid, setMachines)
    return unsub
  }, [user])

  if (loading || !user) return null

  const online = machines.filter((m) => m.status === 'online').length
  const alerts = machines.filter((m) => m.status === 'alert').length
  const offline = machines.filter((m) => m.status === 'offline').length

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Hola, {user.displayName || user.email?.split('@')[0]} 👋
            </h1>
            <p className="text-white/40 text-sm">Panel de control — Lumajira Maquinarias</p>
          </div>
          <Link href="/machines" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Nueva inyectora
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total inyectoras', value: machines.length, icon: <Cpu className="w-5 h-5" />, color: 'text-brand-400' },
            { label: 'En línea', value: online, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
            { label: 'Con alertas', value: alerts, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-yellow-400' },
            { label: 'Sin conexión', value: offline, icon: <WifiOff className="w-5 h-5" />, color: 'text-gray-500' },
          ].map((stat) => (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Machine list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" /> Mis Inyectoras
            </h2>
            <Link href="/machines" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {machines.length === 0 ? (
            <div className="card text-center py-16">
              <Cpu className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-white/60 font-medium mb-2">No tienes inyectoras registradas</h3>
              <p className="text-white/30 text-sm mb-6">Añade tu primera máquina para comenzar el monitoreo</p>
              <Link href="/machines" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Añadir inyectora
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {machines.map((m) => (
                <Link
                  key={m.id}
                  href={`/machines/${m.id}`}
                  className={`card glass-hover cursor-pointer border ${getStatusBg(m.status)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white mb-0.5">{m.name}</h3>
                      {m.description && <p className="text-white/40 text-xs">{m.description}</p>}
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${getStatusColor(m.status)}`}>
                      <span className={`status-dot ${m.status === 'online' ? 'bg-green-400 animate-pulse' : m.status === 'alert' ? 'bg-red-400 animate-pulse' : 'bg-gray-500'}`} />
                      {m.status === 'online' ? 'En línea' : m.status === 'alert' ? 'Alerta' : 'Desconectada'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/40 mt-4">
                    {m.material && (
                      <span className="bg-brand-600/15 text-brand-300 px-2 py-0.5 rounded-full font-medium">
                        {m.material}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" /> Temp
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" /> Presión
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
