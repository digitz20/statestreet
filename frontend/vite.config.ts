import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor_mui'; // Separate Material-UI into its own chunk
            }
            return 'vendor'; // Separate other vendor dependencies
          }
        },
      },
    },
  },
})