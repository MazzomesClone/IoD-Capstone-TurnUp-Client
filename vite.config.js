import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {

  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const API_URL = process.env.VITE_API_URL

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
        '/public': {
          target: API_URL,
          secure: false,
        }
      }
    }
  })
}
