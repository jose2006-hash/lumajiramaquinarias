/**
 * Lumajira Maquinarias — Firmware ESP32
 * Sensor: SCT-013 (corriente alterna)
 * Envía datos a Firebase Realtime Database cada 5 segundos
 *
 * Conexión SCT-013:
 *   - SCT-013 OUT+ → Pin 34 (ADC1_CH6)
 *   - SCT-013 OUT- → GND
 *   - Resistor burden: 33Ω entre PIN34 y GND
 *   - Capacitor: 10µF entre PIN34 y 3.3V (bias al centro)
 */

#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "EmonLib.h"

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
const char* WIFI_SSID     = "José Edin Llanos Dávila";
const char* WIFI_PASSWORD = "12345678";

// Obtén estos valores de Firebase Console > Project Settings
const char* FIREBASE_HOST = "your-project-default-rtdb.firebaseio.com";
const char* FIREBASE_API_KEY = "your_web_api_key_here";

// ID de la máquina (regístrala primero en la app y copia su ID de Firestore)
const char* MACHINE_ID = "your_machine_id_here";

// Pin del sensor SCT-013
const int SCT_PIN = 34;

// Calibración SCT-013 (ajustar según burden resistor)
// Fórmula: calibración = (corriente_max * vueltas) / V_ref_ADC
// Para SCT-013-030 (30A) con burden de 33Ω y ESP32 (3.3V/4095):
const float CALIBRATION = 29.0;

// Intervalo de envío (ms)
const unsigned long SEND_INTERVAL = 5000;

// ─── VARIABLES GLOBALES ───────────────────────────────────────────────────────
FirebaseData fbdo;
FirebaseAuth fbAuth;
FirebaseConfig fbConfig;
EnergyMonitor emon1;

unsigned long lastSend = 0;
bool firebaseReady = false;

// ─── SETUP ───────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== Lumajira Maquinarias — ESP32 Firmware ===");

  // Inicializar sensor SCT-013
  emon1.current(SCT_PIN, CALIBRATION);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  // Conectar WiFi
  connectWiFi();

  // Inicializar Firebase
  fbConfig.host = FIREBASE_HOST;
  fbConfig.api_key = FIREBASE_API_KEY;
  fbAuth.user.email = "";
  fbAuth.user.password = "";

  Firebase.begin(&fbConfig, &fbAuth);
  Firebase.reconnectWiFi(true);

  // Esperar inicialización Firebase
  unsigned long t = millis();
  while (!Firebase.ready() && millis() - t < 10000) {
    Serial.print(".");
    delay(200);
  }
  firebaseReady = Firebase.ready();
  Serial.println(firebaseReady ? "\n✅ Firebase conectado" : "\n❌ Firebase no conectado");
}

// ─── LOOP ────────────────────────────────────────────────────────────────────
void loop() {
  if (millis() - lastSend >= SEND_INTERVAL) {
    lastSend = millis();

    // Leer corriente RMS (200 muestras)
    double irms = emon1.calcIrms(200);

    // Filtrar ruido (< 0.3A = 0)
    if (irms < 0.3) irms = 0.0;

    Serial.printf("📡 Corriente RMS: %.2f A\n", irms);

    if (firebaseReady && WiFi.status() == WL_CONNECTED) {
      sendToFirebase(irms);
    } else {
      Serial.println("⚠️ Sin conexión. Reintentando...");
      connectWiFi();
      firebaseReady = Firebase.ready();
    }
  }
}

// ─── FUNCIONES ───────────────────────────────────────────────────────────────

void connectWiFi() {
  Serial.printf("Conectando a WiFi: %s\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t < 15000) {
    Serial.print(".");
    delay(500);
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n✅ WiFi conectado. IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n❌ No se pudo conectar al WiFi");
  }
}

void sendToFirebase(double current_a) {
  // Ruta: sensors/{machineId}/sct013/{pushId}
  String path = String("sensors/") + MACHINE_ID + "/sct013";

  FirebaseJson json;
  json.set("current_a", current_a);
  json.set("timestamp/.sv", "timestamp");  // Server timestamp
  json.set("sensor", "SCT-013");
  json.set("unit", "A");

  if (Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json)) {
    Serial.printf("✅ Enviado: %.2f A → Firebase\n", current_a);
  } else {
    Serial.printf("❌ Error Firebase: %s\n", fbdo.errorReason().c_str());
  }
}
