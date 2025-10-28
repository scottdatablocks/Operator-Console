import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Harmonix Operator Console — V9 Configuration
export default defineConfig({
  base: '/v9/', // Match Nginx alias
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/app_v9.js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep CSS in assets/css/, everything else in assets/
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})

