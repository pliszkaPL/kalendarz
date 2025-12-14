import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 80,
      host: 'kalendarz.loc'
    },
    allowedHosts: [
      'kalendarz.loc',
      '.kalendarz.loc'
    ],
    watch: {
      usePolling: true
    }
  }
})
