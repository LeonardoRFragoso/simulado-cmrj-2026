import { useSyncExternalStore } from 'react'
import { progressStore } from '../stores/progress'

export function useProgress() {
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.get, progressStore.get)
  return state
}
