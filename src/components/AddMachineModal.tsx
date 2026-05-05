'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { addMachine } from '@/lib/machines'
import { useAuth } from '@/lib/auth-context'

const MATERIALS = ['PP', 'PE', 'ABS', 'PVC', 'PS', 'PET', 'Nylon']

interface Props {
  onClose: () => void
}

export default function AddMachineModal({ onClose }: Props) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    description: '',
    material: 'PP',
    raspberryId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.name.trim()) return
    setLoading(true)
    setError('')
    try {
      await addMachine(user.uid, form)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la inyectora')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Nueva Inyectora</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
              Nombre de la inyectora *
            </label>
            <input
              className="input-field"
              placeholder="Ej: Inyectora Husky 250T"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
              Descripción
            </label>
            <input
              className="input-field"
              placeholder="Descripción opcional"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
              Material principal
            </label>
            <select
              className="input-field"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m} className="bg-gray-900">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
              ID del Raspberry Pi
            </label>
            <input
              className="input-field font-mono text-sm"
              placeholder="Ej: rpi-001 (identificador único)"
              value={form.raspberryId}
              onChange={(e) => setForm({ ...form, raspberryId: e.target.value })}
            />
            <p className="text-white/30 text-xs mt-1.5">
              Este ID se usa para vincular los datos de Firebase con esta máquina.
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>
              ) : (
                <><Plus className="w-4 h-4" /> Añadir</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
