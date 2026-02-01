import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/renderer',
  base: './',
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src'),
      '@shared': resolve('src/shared'),
      '@main': resolve('src/main'),
      'electron-log/renderer': resolve('src/renderer/src/lib/stubs/electron-log-renderer.ts'),
      'electron-ipc-decorator/client': resolve(
        'src/renderer/src/lib/stubs/electron-ipc-client.ts'
      )
    }
  },
  plugins: [
    react(),
    Icons({
      compiler: 'jsx',
      jsx: 'react'
    }),
    tailwindcss()
  ],
  build: {
    outDir: resolve('dist'),
    emptyOutDir: true
  }
})
