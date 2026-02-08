import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // ✅ Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['lucide-react', 'react-hot-toast', 'framer-motion'],
          'charts': ['recharts'],
        },
      },
    },
    // ✅ Minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
    // ✅ CSS code splitting
    cssCodeSplit: true,
    // ✅ Chunk size warnings
    chunkSizeWarningLimit: 600,
    // ✅ Source maps only in development
    sourcemap: false,
  },
  // ✅ Server configuration
  server: {
    compress: true, // Enable gzip compression
  },
  // ✅ Optimization hints
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})

