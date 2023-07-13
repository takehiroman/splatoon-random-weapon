// @ts-check
import { join } from 'path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@/': join(__dirname, 'src/'),
      '/@/': join(__dirname, 'src'),
      components: join(__dirname, 'src/components'),
      pages: join(__dirname, 'src/pages'),
      utils: join(__dirname, 'src/utils'),
      assets: join(__dirname, 'src/assets'),
      styles: join(__dirname, 'src/styles'),
      hooks: join(__dirname, 'src/hooks'),
      store: join(__dirname, 'src/store'),
      types: join(__dirname, 'src/types'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
