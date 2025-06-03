import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
dotenv.config()
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.VITE_SUPABASE_URL": JSON.stringify(process.env.VITE_SUPABASE_URL),
    "process.env.VITE_SUPABASE_PUBLIC_KEY": JSON.stringify(process.env.VITE_SUPABASE_PUBLIC_KEY)
  }
})
