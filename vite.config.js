// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: '/',
//   plugins: [react()],
//   chunkSizeWarningLimit: 1000,
//   outDir: 'build',
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: './build',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Only include React packages that you're definitely using
          'vendor-react': ['react', 'react-dom'],
          // Add other chunks based on what you're actually using in your project
        },
      },
    },
    assetsDir: 'assets',
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})