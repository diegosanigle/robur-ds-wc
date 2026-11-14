/// <reference types="vitest/config" />
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const dirname = import.meta.dirname

export default defineConfig({
  // La librería se publica como módulo ES. Lit queda fuera: lo pone quien la usa.
  build: {
    lib: { entry: path.join(dirname, 'src/index.ts'), formats: ['es'], fileName: 'robur-ds' },
    rollupOptions: { external: [/^lit/] },
  },
  // Si Vite descubre una dependencia a mitad de los tests, recarga y fallan todos: se declaran antes.
  optimizeDeps: { include: ['lit', 'lit/decorators.js', 'lit/directives/*.js', 'storybook/test'] },
  // Cada story de Storybook se ejecuta como un test en un navegador real.
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            // Con movimiento reducido no hay transiciones: axe mide los colores finales, no uno a medias.
            provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
