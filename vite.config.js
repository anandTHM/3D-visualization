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
    outDir: './build', // Make sure path is explicit
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    assetsDir: 'assets',
    minify: 'esbuild'
  }
})