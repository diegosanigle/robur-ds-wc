import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import './metrics-view'

const meta: Meta = {
  title: 'Datos/Métricas',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

/** La última medición del sistema. Se actualiza con `npm run metrics`; ningún número se escribe a mano. */
export const Resumen: Story = {
  render: () => html`<robur-metrics-view></robur-metrics-view>`,
}
