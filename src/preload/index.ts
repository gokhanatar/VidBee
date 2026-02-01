import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { createIpcProxy } from 'electron-ipc-decorator/client'
import type { IpcServices } from '../main/ipc'

// Create type-safe IPC proxy using electron-ipc-decorator
const ipcServices = createIpcProxy<IpcServices>(ipcRenderer)

const ALLOWED_CHANNELS = new Set([
  'download:deeplink',
  'download:started',
  'download:progress',
  'download:log',
  'download:completed',
  'download:error',
  'download:cancelled',
  'subscriptions:updated',
  'update:available',
  'update:not-available',
  'update:downloaded',
  'update:error',
  'update:download-progress',
  'window-maximized',
  'window-unmaximized'
])

// Custom APIs for renderer
const api = {
  // IPC Services (type-safe, using decorators)
  ...ipcServices,

  // Event listening API (whitelisted channels only)
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    if (!ALLOWED_CHANNELS.has(channel)) return undefined
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)
    return subscription
  },
  removeListener: (channel: string, callback: (...args: unknown[]) => void) => {
    if (!ALLOWED_CHANNELS.has(channel)) return
    ipcRenderer.removeListener(channel, callback)
  },
  // Send message to main process (whitelisted channels only)
  send: (channel: string, ...args: unknown[]) => {
    if (!ALLOWED_CHANNELS.has(channel)) return
    ipcRenderer.send(channel, ...args)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose APIs in context bridge:', error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
