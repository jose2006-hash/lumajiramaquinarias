"""
Lumajira Maquinarias — Script para Raspberry Pi
================================================
Lee sensores de temperatura y presión y envía datos a Firebase Realtime Database.

Hardware requerido:
  - Sensor de temperatura: DS18B20 (GPIO 4) o termopar tipo K con MAX6675
  - Sensor de presión: 4–20 mA + resistencia 250Ω → voltaje 1–5V → ADS1115 (I2C)
  - Raspberry Pi (cualquier modelo con GPIO)

Instalación de dependencias:
  pip install firebase-admin adafruit-ads1x15 w1thermsensor

Configuración:
  1. Descarga el archivo de credenciales de tu Firebase (serviceAccountKey.json)
     desde Firebase Console > Configuración > Cuentas de servicio > Generar nueva clave privada
  2. Copia el archivo al mismo directorio que este script
  3. Edita MACHINE_ID con el raspberryId que asignaste en la plataforma
  4. Edita DATABASE_URL con tu URL de Firebase Realtime Database
"""

import time
import json
import os
import random  # Solo para modo de demostración

# ── Importaciones del hardware ─────────────────────────────────────────────
# Descomenta según tu hardware:

# Para DS18B20 (temperatura):
# from w1thermsensor import W1ThermSensor

# Para ADS1115 + sensor de presión 4-20mA:
# import Adafruit_ADS1x15

# Para Firebase:
import firebase_admin
from firebase_admin import credentials, db

# ── Configuración ──────────────────────────────────────────────────────────
MACHINE_ID = "rpi-001"          # ← Cambia esto al raspberryId de tu máquina
DATABASE_URL = "https://TU_PROYECTO-default-rtdb.firebaseio.com"  # ← Tu URL

SAMPLE_INTERVAL = 1.0           # Intervalo de lectura en segundos
PRESSURE_MAX_BAR = 2000.0       # Presión máxima del sensor en bar
DEMO_MODE = True                # True = datos simulados, False = hardware real

# ── Inicialización Firebase ────────────────────────────────────────────────
def init_firebase():
    cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
    if not os.path.exists(cred_path):
        raise FileNotFoundError(
            "No se encontró serviceAccountKey.json. "
            "Descárgalo desde Firebase Console > Configuración > Cuentas de servicio."
        )
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})
    print(f"✅ Firebase conectado — máquina: {MACHINE_ID}")

# ── Lectura de temperatura ─────────────────────────────────────────────────
def read_temperature() -> float:
    if DEMO_MODE:
        # Simula temperatura con ruido para demostración
        return round(random.gauss(215, 8), 1)

    # Hardware real — DS18B20:
    # sensor = W1ThermSensor()
    # return round(sensor.get_temperature(), 1)

    # Hardware real — Termopar K con MAX6675:
    # (implementar según librería del módulo)
    return 0.0

# ── Lectura de presión ─────────────────────────────────────────────────────
def read_pressure() -> float:
    if DEMO_MODE:
        # Simula presión con ruido para demostración
        return round(random.gauss(1050, 80), 0)

    # Hardware real — ADS1115 + sensor 4-20mA:
    # adc = Adafruit_ADS1x15.ADS1115()
    # GAIN = 1  # ±4.096V
    # raw = adc.read_adc(0, gain=GAIN)
    # voltage = raw * 4.096 / 32767
    # # Convertir 1-5V a 0-PRESSURE_MAX_BAR
    # pressure = (voltage - 1.0) / 4.0 * PRESSURE_MAX_BAR
    # return round(max(0, pressure), 0)
    return 0.0

# ── Verificación de alertas ────────────────────────────────────────────────
def check_alerts(temp: float, pressure: float) -> str:
    if temp > 280 or pressure > 1500:
        return "alert"
    return "online"

# ── Loop principal ─────────────────────────────────────────────────────────
def main():
    init_firebase()

    readings_ref = db.reference(f"machines/{MACHINE_ID}/readings")
    status_ref   = db.reference(f"machines/{MACHINE_ID}/status")

    print(f"📡 Leyendo sensores cada {SAMPLE_INTERVAL}s — Ctrl+C para detener\n")

    try:
        while True:
            temp     = read_temperature()
            pressure = read_pressure()
            ts       = int(time.time() * 1000)  # milisegundos

            data = {
                "temperature": temp,
                "pressure":    pressure,
                "timestamp":   ts,
            }

            # Enviar a Firebase
            readings_ref.push(data)
            status_ref.set(check_alerts(temp, pressure))

            print(f"[{time.strftime('%H:%M:%S')}] 🌡  {temp}°C  📊  {pressure} bar")
            time.sleep(SAMPLE_INTERVAL)

    except KeyboardInterrupt:
        print("\n🛑 Script detenido.")
        status_ref.set("offline")

if __name__ == "__main__":
    main()
