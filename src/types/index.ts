export interface Machine {
  id: string
  name: string
  description?: string
  material?: string
  ownerId: string
  createdAt: number
  status: 'online' | 'offline' | 'alert'
  raspberryId?: string
}

export interface SensorReading {
  timestamp: number
  pressure: number
  temperature: number
  machineId: string
}

export interface Alert {
  id: string
  machineId: string
  type: 'temperature_high' | 'pressure_high' | 'temperature_low' | 'pressure_low' | 'offline'
  message: string
  timestamp: number
  resolved: boolean
}

export interface AIRecommendation {
  machineId: string
  timestamp: number
  material: string
  currentTemp: number
  recommendedTemp: number
  currentPressure: number
  recommendedPressure: number
  reasoning: string
  action: string
}

export interface User {
  uid: string
  email: string
  displayName?: string
  company?: string
}
