import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This must match your repo name with slashes
  base: '/rewrite_my_way/', 
})
