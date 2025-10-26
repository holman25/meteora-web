// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',        // evita jsdom + parse5 error
    globals: true,
    setupFiles: ['./tests/setup.ts'], // opcional, para mocks globales
    deps: {
      inline: [/vue/, /@vue/, /happy-dom/],
    },
  },
})
