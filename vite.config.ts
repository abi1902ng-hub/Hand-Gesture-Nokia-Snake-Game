import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Hand-Gesture-Nokia-Snake-Game/',

  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/phaser')) return 'phaser'
          if (id.includes('node_modules/@mediapipe')) return 'mediapipe'
        },
      },
    },
  },
})