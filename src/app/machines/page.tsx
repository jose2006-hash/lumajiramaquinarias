'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { subscribeMachines, deleteMachine } from '@/lib/machines'
import Navbar from '@/components/Navbar'
import AddMachineModal from '@/components/AddMachineModal'
import type { Machine } from '@/types'
import { Plus, Cpu, Trash2, ExternalLink, AlertTriangle } from 'lucide-react'
import { getStatusColor, getStatusBg, formatDate } from '@/lib/utils'

export default function MachinesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [machines, setMachines] = useState<Machine[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    return subscribeMachines(user.uid, setMachines)
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta inyectora? Se borrarán todos sus datos.')) return
    setDeleting(id)
    await deleteMachine(id)
    setDeleting(null)
  }

  if (loading || !user) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Mis Inyectoras</h1>
            <p className="text-white/40 text-sm">{machines.length} máquina{machines.length !== 1 ? 's' : ''} registrada{machines.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Nueva inyectora
          </button>
        </div>

        {machines.length === 0 ? (
          <div className="card text-center py-20">
            <Cpu className="w-14 h-14 text-white/10 mx-auto mb-5" />
            <h3 className="text-white/60 font-semibold text-lg mb-2">Ninguna inyectora registrada</h3>
            <p className="text-white/30 text-sm mb-8 max-w-sm mx-auto">
              Añade tu primera máquina indicando su nombre, el material que procesa y el ID del Raspberry Pi.
            </p>
            <button onClick={() => setShowAdd(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Añadir primera inyectora
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {machines.map((m) => (
              <div key={m.id} className={`card border glass-hover flex flex-col ${getStatusBg(m.status)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{m.name}</h3>
                    {m.description && <p className="text-white/40 text-sm mt-0.5">{m.description}</p>}
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ml-2 ${getStatusColor(m.status)}`}>
                    <span className={`status-dot ${m.status === 'online' ? 'bg-green-400 animate-pulse' : m.status === 'alert' ? 'bg-red-400 animate-pulse' : 'bg-gray-500'}`} />
                    {m.status === 'online' ? 'En línea' : m.status === 'alert' ? 'Alerta' : 'Desconectada'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-white/50 flex-1">
                  {m.material && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 w-20 shrink-0">Material</span>
                      <span className="bg-brand-600/15 text-brand-300 px-2 py-0.5 rounded-full text-xs font-medium">{m.material}</span>
                    </div>
                  )}
                  {m.raspberryId && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 w-20 shrink-0">Raspberry</span>
                      <span className="font-mono text-xs text-white/60">{m.raspberryId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 w-20 shrink-0">Creada</span>
                    <span>{formatDate(m.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
                  <Link href={`/machines/${m.id}`} className="btn-primary flex-1 text-center text-sm py-2 flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Ver detalles
                  </Link>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deleting === m.id}
                    className="btn-secondary text-sm py-2 px-3 text-red-400 border-red-500/20 hover:border-red-500/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddMachineModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
