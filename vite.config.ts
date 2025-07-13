import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    adonisjs({ entrypoints: ['inertia/app/app.ts', 'inertia/css/app.css'], reload: ['resources/views/**/*.edge'] }),
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '@': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
