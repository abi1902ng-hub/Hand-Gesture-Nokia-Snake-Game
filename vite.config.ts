import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Phaser's own bundle is inherently large (~1.3MB unminified engine
    // code) — this isn't something we can reduce without dropping features,
    // so the default 500kB warning threshold is raised to reflect what's
    // actually normal for this dependency instead of flagging expected size.
    chunkSizeWarningLimit: 1500,
    // Phaser and MediaPipe are both large and rarely change together with
    // app code — splitting them into their own chunks means a code change
    // elsewhere doesn't force users to re-download these on every deploy,
    // and it silences the "chunk > 500kB" warning by giving each dependency
    // its own reasonably-sized file instead of one giant bundle.
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/phaser')) return 'phaser';
          if (id.includes('node_modules/@mediapipe')) return 'mediapipe';
        },
      },
    },
  },
})
