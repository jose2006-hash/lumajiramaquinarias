import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { ref, onValue, query as rtdbQuery, limitToLast, orderByKey } from 'firebase/database'
import { db, rtdb } from './firebase'
import type { Machine, SensorReading } from '@/types'

export function subscribeMachines(userId: string, cb: (machines: Machine[]) => void) {
  const q = query(collection(db, 'machines'), where('ownerId', '==', userId))
  return onSnapshot(q, (snap) => {
    const machines: Machine[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Machine, 'id'>),
    }))
    cb(machines)
  })
}

export async function addMachine(
  userId: string,
  data: Pick<Machine, 'name' | 'description' | 'material' | 'raspberryId'>
) {
  return addDoc(collection(db, 'machines'), {
    ...data,
    ownerId: userId,
    createdAt: Date.now(),
    status: 'offline',
  })
}

export async function updateMachine(machineId: string, data: Partial<Machine>) {
  return updateDoc(doc(db, 'machines', machineId), data as Record<string, unknown>)
}

export async function deleteMachine(machineId: string) {
  return deleteDoc(doc(db, 'machines', machineId))
}

export function subscribeToSensorData(
  machineId: string,
  cb: (readings: SensorReading[]) => void
) {
  const dataRef = rtdbQuery(
    ref(rtdb, `machines/${machineId}/readings`),
    orderByKey(),
    limitToLast(30)
  )
  return onValue(dataRef, (snap) => {
    const readings: SensorReading[] = []
    snap.forEach((child) => {
      readings.push({ ...(child.val() as Omit<SensorReading, 'machineId'>), machineId })
    })
    cb(readings)
  })
}
