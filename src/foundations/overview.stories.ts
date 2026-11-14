import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { sampler } from './sampler'

const meta: Meta = {
  title: 'Resumen/Todos los componentes',
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj

/**
 * Todos los componentes en los dos temas a la vez.
 * Sirve para ver el sistema de un vistazo y para que los tests de accesibilidad cubran también el tema oscuro.
 * Las variables de tokens.css atraviesan el Shadow DOM: basta con `data-theme` en un contenedor.
 */
export const ClaroYOscuro: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr))">
      <div data-theme="light">${sampler()}</div>
      <div data-theme="dark">${sampler()}</div>
    </div>
  `,
}
