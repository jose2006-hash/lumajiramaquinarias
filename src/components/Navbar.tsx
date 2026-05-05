'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { LogOut, Cpu, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-brand-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Lumajira <span className="text-brand-400 font-light">Maquinarias</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/machines" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  Mis Inyectoras
                </Link>
                <span className="text-white/30 text-sm">{user.email}</span>
                <button onClick={logout} className="flex items-center gap-1.5 text-white/60 hover:text-red-400 text-sm transition-colors">
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-white/80 text-sm" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/machines" className="text-white/80 text-sm" onClick={() => setOpen(false)}>Mis Inyectoras</Link>
              <button onClick={() => { logout(); setOpen(false) }} className="text-red-400 text-sm text-left">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/80 text-sm" onClick={() => setOpen(false)}>Iniciar sesión</Link>
              <Link href="/register" className="btn-primary text-sm text-center" onClick={() => setOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
