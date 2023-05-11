import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import sass from 'sass'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'sass',
      plugin: async () => {
        const sassPlugin = await import('sass')
        return {
          syntax: 'scss',
        }
      }
    },
  ],
})
