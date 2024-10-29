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

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1000,
    // You might also want to add this to ensure the build directory is cleaned before each build
    emptyOutDir: true
  }
})