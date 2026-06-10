# Lumajira Maquinarias — Sistema de Monitoreo Industrial

Sistema para monitorear máquinas de inyección en tiempo real usando ESP32 + Firebase + React.

## 📁 Estructura del proyecto

```
lumajira/
├── src/                    ← App React (web)
│   ├── firebase/config.js  ← Configuración Firebase
│   ├── hooks/useAuth.js    ← Auth con Firebase
│   ├── pages/
│   │   ├── SplashPage.jsx  ← Pantalla inicial con foto del equipo
│   │   ├── AuthPage.jsx    ← Login y registro
│   │   └── Dashboard.jsx   ← Monitoreo en tiempo real
│   └── utils/alerts.js     ← Lógica de mantenimiento predictivo
├── esp32/
│   ├── platformio.ini      ← Configuración PlatformIO
│   └── src/main.cpp        ← Firmware ESP32
├── .env.example            ← Variables de entorno (copiar a .env)
├── firebase-rtdb-rules.json← Reglas Firebase Realtime DB
├── firestore.rules         ← Reglas Firestore
└── vercel.json             ← Configuración Vercel
```

---

## 🔧 1. Configurar Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) → Crear proyecto
2. Activa **Authentication** → Email/Password
3. Crea **Firestore Database** (modo producción)
4. Crea **Realtime Database** (modo prueba por ahora)
5. En Project Settings → Web → Registra una app → copia las credenciales

### Aplicar reglas de seguridad:

**Firestore:** copia el contenido de `firestore.rules`  
**Realtime DB:** copia el contenido de `firebase-rtdb-rules.json`

---

## 🌐 2. Configurar la app React

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env (copia desde .env.example y llena los valores)
cp .env.example .env

# 3. Agrega la foto del equipo:
# Guarda la imagen como: src/assets/team.png

# 4. Desarrollo local
npm start

# 5. Build para producción
npm run build
```

---

## 📡 3. Configurar ESP32 (PlatformIO)

### Hardware necesario:
| Componente | Detalle |
|---|---|
| ESP32 DevKit | Cualquier versión |
| SCT-013-030 | Sensor de corriente 30A |
| Resistor burden | 33Ω (para SCT-013-030) |
| Capacitor | 10µF electrolítico |

### Conexión SCT-013:
```
SCT-013 (jack 3.5mm):
  Tip (señal) → PIN 34 del ESP32
  Sleeve (GND) → GND del ESP32

Circuito de acondicionamiento:
  PIN 34 ──┬── Resistor 33Ω ── GND
           │
           └── Capacitor 10µF (+) ── 3.3V
                                (−) ── GND
```

### Configurar firmware:
Edita `esp32/src/main.cpp` y cambia:
```cpp
const char* FIREBASE_HOST = "TU-PROYECTO-default-rtdb.firebaseio.com";
const char* FIREBASE_API_KEY = "tu_api_key";
const char* MACHINE_ID = "id_de_tu_maquina_en_firestore";
```

```bash
# Compilar y subir
cd esp32
pio run --target upload
pio device monitor  # Ver logs
```

---

## 🚀 4. Desplegar en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Agregar variables de entorno en Vercel Dashboard:
# Settings → Environment Variables → pega todos los REACT_APP_*
```

---

## 📊 APIs recomendadas

| API | Uso | URL |
|---|---|---|
| **Firebase Realtime DB** | Datos en tiempo real del ESP32 | firebase.google.com |
| **Firebase Firestore** | Usuarios, máquinas, config | firebase.google.com |
| **Firebase Auth** | Login/registro | firebase.google.com |
| **Twilio** | Alertas por SMS/WhatsApp | twilio.com |
| **SendGrid** | Alertas por email | sendgrid.com |
| **PushOver / Firebase Cloud Messaging** | Notificaciones push móvil | firebase.google.com/fcm |
| **InfluxDB Cloud** | Series temporales avanzadas (futuro) | influxdata.com |

---

## ⚠️ Umbrales de alerta — SCT-013 Resistencias de Banda

| Nivel | Corriente | Acción |
|---|---|---|
| Normal | 0.5 – 8.0 A | Sin acción |
| Advertencia | 8.0 – 10.0 A | Revisar en 2h |
| Crítico | > 10.0 A | Detener máquina |
| Sin señal | < 0.3 A | Verificar conexiones |

---

## 🔮 Roadmap futuro

- [ ] Sensor de temperatura (DS18B20) en cilindros
- [ ] Sensor de presión hidráulica (4-20mA)
- [ ] Contador de ciclos (encoder o reed switch)
- [ ] Notificaciones WhatsApp vía Twilio
- [ ] Reporte PDF mensual automático
- [ ] Dashboard multi-máquina
