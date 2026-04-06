import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Replace 'rewrite-my-way' with your EXACT GitHub repository name
  base: '/rewrite-my-way/', 
})
