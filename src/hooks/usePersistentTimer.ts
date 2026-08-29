import { useCallback, useEffect, useRef, useState } from 'react'

interface PersistedTimer {
  startedAt: number // epoch ms
  totalSeconds: number
  /** true enquanto o cronômetro corre; false quando pausado/encerrado */
  running: boolean
}

export interface TimerState {
  remainingSeconds: number
  running: boolean
  expired: boolean
}

export interface UsePersistentTimerOptions {
  storageKey: string
  totalSeconds: number
  onExpire?: () => void
  /** limiares em segundos para disparar alertas (uma vez cada) */
  alertThresholds?: number[]
  onAlert?: (remainingSeconds: number) => void
}

/**
 * Cronômetro persistente: salva o início no localStorage e restaura após reload.
 * Calcula o restante a partir do startedAt, garantindo precisão mesmo se o app
 * ficar fechado. Dispara onExpire quando zera e onAlert nos limiares.
 */
export function usePersistentTimer(opts: UsePersistentTimerOptions) {
  const { storageKey, totalSeconds, onExpire, alertThresholds = [], onAlert } = opts
  const [state, setState] = useState<TimerState>(() => loadOrInit(storageKey, totalSeconds))
  const firedAlerts = useRef<Set<number>>(new Set())
  const onExpireRef = useRef(onExpire)
  const onAlertRef = useRef(onAlert)
  onExpireRef.current = onExpire
  onAlertRef.current = onAlert

  const persist = useCallback((s: PersistedTimer) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(s))
    } catch {
      // ignore
    }
  }, [storageKey])

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [storageKey])

  // tick a cada segundo
  useEffect(() => {
    if (!state.running) return
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.running) return prev
        const raw = readRaw(storageKey)
        if (!raw) return prev
        const elapsed = Math.floor((Date.now() - raw.startedAt) / 1000)
        const remaining = Math.max(0, raw.totalSeconds - elapsed)
        // alertas
        if (onAlertRef.current && alertThresholds.length) {
          for (const th of alertThresholds) {
            if (remaining <= th && remaining > 0 && !firedAlerts.current.has(th)) {
              firedAlerts.current.add(th)
              onAlertRef.current(remaining)
            }
          }
        }
        if (remaining <= 0) {
          if (onExpireRef.current) onExpireRef.current()
          return { remainingSeconds: 0, running: false, expired: true }
        }
        return { ...prev, remainingSeconds: remaining }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.running, storageKey, alertThresholds])

  const start = useCallback(() => {
    const startedAt = Date.now()
    const next: PersistedTimer = { startedAt, totalSeconds, running: true }
    persist(next)
    firedAlerts.current = new Set()
    setState({ remainingSeconds: totalSeconds, running: true, expired: false })
  }, [persist, totalSeconds])

  const stop = useCallback(() => {
    const raw = readRaw(storageKey)
    if (raw) persist({ ...raw, running: false })
    setState((prev) => ({ ...prev, running: false }))
  }, [persist, storageKey])

  const reset = useCallback(() => {
    clear()
    firedAlerts.current = new Set()
    setState({ remainingSeconds: totalSeconds, running: false, expired: false })
  }, [clear, totalSeconds])

  return { state, start, stop, reset, clear }
}

function readRaw(key: string): PersistedTimer | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as PersistedTimer
  } catch {
    return null
  }
}

function loadOrInit(key: string, totalSeconds: number): TimerState {
  const raw = readRaw(key)
  if (!raw) return { remainingSeconds: totalSeconds, running: false, expired: false }
  const elapsed = Math.floor((Date.now() - raw.startedAt) / 1000)
  const remaining = Math.max(0, raw.totalSeconds - elapsed)
  const expired = remaining <= 0
  return { remainingSeconds: remaining, running: raw.running && !expired, expired }
}

export function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
