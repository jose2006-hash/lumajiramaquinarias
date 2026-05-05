import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const MATERIAL_OPTIMAL: Record<string, { temp: [number, number]; pressure: [number, number] }> = {
  PP: { temp: [200, 230], pressure: [800, 1200] },
  PE: { temp: [160, 200], pressure: [700, 1100] },
  ABS: { temp: [220, 250], pressure: [900, 1300] },
  PVC: { temp: [170, 200], pressure: [750, 1100] },
  PS: { temp: [180, 220], pressure: [800, 1200] },
  PET: { temp: [260, 290], pressure: [1000, 1400] },
  Nylon: { temp: [250, 280], pressure: [900, 1300] },
}

export function getStatusColor(status: 'online' | 'offline' | 'alert') {
  switch (status) {
    case 'online': return 'text-green-400'
    case 'offline': return 'text-gray-400'
    case 'alert': return 'text-red-400'
  }
}

export function getStatusBg(status: 'online' | 'offline' | 'alert') {
  switch (status) {
    case 'online': return 'bg-green-500/10 border-green-500/30'
    case 'offline': return 'bg-gray-500/10 border-gray-500/30'
    case 'alert': return 'bg-red-500/10 border-red-500/30'
  }
}
