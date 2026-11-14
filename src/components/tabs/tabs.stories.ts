import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburTabs, Tab } from './tabs'
import './tabs'

const TABS: Tab[] = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'ano', label: 'Año' },
]

// Las props y el evento `change`.
type Args = Pick<RoburTabs, 'label' | 'tabs' | 'value'> & { onChange: (value: string) => void }

const text = 'margin: 0; font-size: var(--text-body)'

const meta: Meta<Args> = {
  title: 'Componentes/Tabs',
  component: 'robur-tabs',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Periodo', tabs: TABS, value: 'semana', onChange: fn() },
  decorators: [(story) => html`<div style="width: 20rem">${story()}</div>`],
  render: (args) => html`
    <robur-tabs label=${args.label} .tabs=${args.tabs} value=${args.value} @change=${(event: CustomEvent<string>) => args.onChange(event.detail)}></robur-tabs>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const DosPestanas: Story = { args: { tabs: TABS.slice(0, 2) } }

export const ConContenido: Story = {
  render: (args) => html`
    <robur-tabs label=${args.label} .tabs=${args.tabs} value=${args.value}><p style=${text}>Tres sesiones esta semana.</p></robur-tabs>
  `,
}

/** Comprueba el uso con teclado: la flecha derecha pasa a la pestaña siguiente y le da el foco. */
export const Interaccion: Story = {
  render: (args) => html`
    <robur-tabs
      label=${args.label}
      .tabs=${args.tabs}
      value="semana"
      @change=${(event: CustomEvent<string>) => {
        const tabs = event.currentTarget as RoburTabs
        tabs.value = event.detail
        tabs.querySelector('p')!.textContent = `Periodo: ${event.detail}`
      }}
      ><p style=${text}>Periodo: semana</p></robur-tabs
    >
  `,
  play: async ({ canvasElement }) => {
    const tabs = inside(canvasElement, 'robur-tabs')
    await userEvent.click(tabs.getByRole('tab', { name: 'Semana' }))
    await userEvent.keyboard('{ArrowRight}')
    const mes = tabs.getByRole('tab', { name: 'Mes' })
    await expect(mes).toHaveAttribute('aria-selected', 'true')
    // Desde fuera, el foco está en <robur-tabs>; dentro de su Shadow DOM, en la pestaña.
    await expect(canvasElement.querySelector('robur-tabs')!.shadowRoot!.activeElement).toBe(mes)
    // El panel muestra el contenido que hay entre las etiquetas: se lee ahí.
    await expect(tabs.getByRole('tabpanel')).toBeVisible()
    await expect(canvasElement.querySelector('robur-tabs p')).toHaveTextContent('Periodo: mes')
  },
}
