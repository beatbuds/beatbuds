import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: "127.0.0.1"
  },
  define: {
    // 1. Define 'process.env' to handle general environment checks
    'process.env': {}, 
    
    // 2. Define 'process.cwd' to prevent the specific function call error
    'process.cwd': '() => "/"', // <-- ADD THIS LINE
    
    // You might also need the full 'process' object definition if other methods fail
    'process': {
        env: {},
        cwd: () => '/',
    },
  },
})
