import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    reportCompressedSize: false, // Speed up build
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['lucide-react', 'downloadjs', 'html-to-image'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'vendor-charts': ['circular-natal-horoscope-js'],
        }
      }
    },
    minify: 'esbuild', // Ensure esbuild is used for speed
    sourcemap: false // Disable sourcemaps for production build speed
  }
})
