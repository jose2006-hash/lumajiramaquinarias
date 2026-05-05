'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Cpu, Thermometer, Gauge, Brain, Shield, Zap, ArrowRight, Github, Radio } from 'lucide-react'

const features = [
  {
    icon: <Radio className="w-5 h-5 text-brand-400" />,
    title: 'Monitoreo en Tiempo Real',
    desc: 'Captura continua de temperatura y presión desde sensores Raspberry Pi conectados a cada inyectora.',
  },
  {
    icon: <Brain className="w-5 h-5 text-brand-400" />,
    title: 'IA Agéntica',
    desc: 'El sistema analiza parámetros según el material inyectado (PP, ABS, PE...) y ajusta automáticamente para el ciclo óptimo.',
  },
  {
    icon: <Shield className="w-5 h-5 text-brand-400" />,
    title: 'Predicción de Fallas',
    desc: 'Detecta anomalías antes de que ocurran paradas costosas y reduce el scrap hasta en un 40%.',
  },
  {
    icon: <Thermometer className="w-5 h-5 text-brand-400" />,
    title: 'Control de Temperatura',
    desc: 'Ajuste automático al rango óptimo por material. Si inyectas PP, el sistema reduce a 200-230°C sin intervención manual.',
  },
  {
    icon: <Gauge className="w-5 h-5 text-brand-400" />,
    title: 'Control de Presión',
    desc: 'Monitoreo y alertas de presión en bar para proteger moldes y garantizar piezas sin defectos.',
  },
  {
    icon: <Zap className="w-5 h-5 text-brand-400" />,
    title: 'Firebase en la Nube',
    desc: 'Todos los datos de cada máquina se almacenan en Firebase. Accede desde cualquier dispositivo.',
  },
]

const steps = [
  { num: '01', title: 'Crea tu cuenta', desc: 'Regístrate y accede a tu panel de control personal.' },
  { num: '02', title: 'Añade tus inyectoras', desc: 'Registra cada máquina con nombre, material y ID del Raspberry Pi.' },
  { num: '03', title: 'Conecta los sensores', desc: 'El kit Raspberry Pi lee los sensores de presión y temperatura y envía datos a Firebase.' },
  { num: '04', title: 'La IA toma el control', desc: 'El agente monitorea, predice fallas y sugiere ajustes automáticos en tiempo real.' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/50 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-up">
              <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="status-dot bg-green-400 animate-pulse-slow" />
                Plataforma IoT + IA para inyección de plásticos
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                Control inteligente de{' '}
                <span className="text-brand-400">maquinarias inyectoras</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Conecta tus inyectoras vía Raspberry Pi, monitorea presión y temperatura en tiempo real,
                y deja que la IA optimice automáticamente los parámetros según el material.
                Predice fallas antes de que ocurran.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary flex items-center gap-2">
                  Comenzar gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="btn-secondary">
                  Iniciar sesión
                </Link>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-brand-700/30 shadow-2xl shadow-brand-900/40 col-span-1 aspect-[3/4]">
                <Image
                  src="/team.png"
                  alt="Equipo Lumajira Maquinarias"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">Equipo Lumajira</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-brand-700/30 shadow-2xl shadow-brand-900/40 col-span-1 aspect-[3/4] mt-8">
                <Image
                  src="/machine.png"
                  alt="Máquina inyectora industrial"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">Inyectora industrial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '< 1s', label: 'Latencia de datos' },
            { value: '40%', label: 'Reducción de scrap' },
            { value: '24/7', label: 'Monitoreo continuo' },
            { value: '7+', label: 'Materiales soportados' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-brand-400 mb-1">{s.value}</p>
              <p className="text-white/40 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Todo lo que necesita tu planta</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Una plataforma completa que conecta hardware con inteligencia artificial para maximizar la eficiencia de producción.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card glass-hover">
                <div className="w-10 h-10 bg-brand-600/15 rounded-lg flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Cómo funciona</h2>
            <p className="text-white/50">En 4 pasos tienes tu planta conectada</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-700/50 to-transparent z-10" />
                )}
                <div className="card">
                  <div className="text-4xl font-bold text-brand-600/30 mb-3">{s.num}</div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Raspberry Pi section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto card">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                <Cpu className="w-3 h-3" /> Kit Raspberry Pi
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Hardware + Software listos para conectar
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Cada inyectora recibe un kit electrónico con Raspberry Pi que lee los sensores de presión y temperatura
                y envía los datos en tiempo real a Firebase Realtime Database. Después, la plataforma con IA
                procesa estos datos y actúa automáticamente.
              </p>
              <div className="space-y-2">
                {[
                  'Sensor de temperatura DS18B20 / termopar tipo K',
                  'Sensor de presión 4-20mA vía ADS1115',
                  'Script Python incluido para el Raspberry Pi',
                  'Conexión directa a Firebase desde el dispositivo',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-950/60 rounded-xl p-5 font-mono text-xs text-green-300 border border-green-500/10">
              <p className="text-white/30 mb-3"># Script Raspberry Pi (incluido en el ZIP)</p>
              <p><span className="text-blue-400">import</span> firebase_admin, time, Adafruit_ADS1x15</p>
              <p className="mt-2"><span className="text-blue-400">db</span> = firebase_admin.db.reference(</p>
              <p className="pl-4">{`'machines/{raspberry_id}/readings'`}</p>
              <p>)</p>
              <p className="mt-2"><span className="text-blue-400">while</span> True:</p>
              <p className="pl-4">temp = read_temperature()</p>
              <p className="pl-4">pressure = read_pressure()</p>
              <p className="pl-4">db.push({'{'}</p>
              <p className="pl-8">{`'temperature': temp,`}</p>
              <p className="pl-8">{`'pressure': pressure,`}</p>
              <p className="pl-8">{`'timestamp': time.time() * 1000`}</p>
              <p className="pl-4">{'}'}</p>
              <p className="pl-4">time.sleep(1)</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Empieza a monitorear tus inyectoras hoy
          </h2>
          <p className="text-white/50 mb-8">
            Regístrate, añade tus máquinas y conecta el Raspberry Pi. La plataforma hace el resto.
          </p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Crear cuenta gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
              <Cpu className="w-3 h-3 text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">Lumajira Maquinarias</span>
          </div>
          <p className="text-white/30 text-xs">
            Desplegado en Vercel · Datos en Firebase · Código en GitHub
          </p>
        </div>
      </footer>
    </div>
  )
}
