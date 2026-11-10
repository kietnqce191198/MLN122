import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    // Proxy chuyển tiếp để vượt lỗi CORS khi gọi trực tiếp từ trình duyệt
    proxy: {
      '/api/fpt-tts': {
        target: 'https://api.fpt.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fpt-tts/, '/hws/v2'),
        headers: {
          'Origin': 'https://api.fpt.ai'
        }
      },
      '/api/zalo-tts': {
        target: 'https://api.zalo.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zalo-tts/, '/v1/tts'),
        headers: {
          'Origin': 'https://api.zalo.ai'
        }
      }
    }
  }
})
