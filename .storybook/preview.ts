import { setCustomElementsManifest, type Preview } from '@storybook/web-components-vite'
import '../src/styles/index.css'
// Registra todas las etiquetas <robur-*> antes de pintar cualquier story.
import '../src/index'
// El manifiesto (generado con npm run cem) da a Storybook las props, eventos y slots de cada etiqueta.
import manifest from '../custom-elements.json'

setCustomElementsManifest(manifest)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    // 'error': un fallo de accesibilidad rompe los tests.
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['Fundamentos', 'Componentes', 'Patrones', 'Pantallas', 'Resumen', 'Datos'] },
    },
  },
  // Selector de tema en la barra de Storybook.
  globalTypes: {
    theme: {
      description: 'Tema del sistema',
      toolbar: {
        title: 'Tema',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Oscuro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      document.documentElement.dataset.theme = context.globals.theme
      return story()
    },
  ],
}

export default preview
