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
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
