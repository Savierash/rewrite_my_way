import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rewrite_my_way/', // This must match your GitHub repository name exactly
})
