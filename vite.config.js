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
    outDir: 'build',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500, // Increased limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@mui/material', '@mui/icons-material'], // if you're using Material UI
          'vendor-utils': ['lodash', 'axios'], // other large dependencies
        },
      },
    },
    // Ensure the build directory is created
    assetsDir: 'assets',
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})