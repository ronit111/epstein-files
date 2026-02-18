import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@data': '/data',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Heavy graph library gets its own chunk
          if (id.includes('force-graph') || id.includes('d3-')) {
            return 'force-graph'
          }
          // GSAP for intro only
          if (id.includes('gsap') || id.includes('ScrollTrigger')) {
            return 'gsap'
          }
          // Framer motion for UI animations
          if (id.includes('framer-motion')) {
            return 'motion'
          }
        },
      },
    },
  },
})
