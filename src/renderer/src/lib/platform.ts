import { Capacitor } from '@capacitor/core'

export type AppPlatform = 'electron' | 'ios' | 'android' | 'web'

export function isElectron(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!(window as { electron?: { ipcRenderer?: unknown } }).electron?.ipcRenderer
  )
}

export function isCapacitor(): boolean {
  return Capacitor.isNativePlatform()
}

export function getPlatform(): AppPlatform {
  if (isElectron()) return 'electron'
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform() as 'ios' | 'android'
  }
  return 'web'
}

export function isNative(): boolean {
  return isElectron() || isCapacitor()
}
