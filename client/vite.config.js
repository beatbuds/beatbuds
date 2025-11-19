import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "https://beatbuds.onrender.co"
  },
  define: {
    'process.env': {},
    'process.cwd': JSON.stringify('/'),
    'process': {
      env: {}
    }
  }
})
