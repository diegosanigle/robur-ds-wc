import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { inside } from '../../stories/shadow'
import '../button'
import type { RoburSheet } from './sheet'
import './sheet'

const content = html`<p style="margin: 0; font-size: var(--text-body)">Tres sesiones: empuje, tirón y pierna.</p>`

// Las props y el evento `close`.
type Args = Pick<RoburSheet, 'open' | 'title'> & { onClose: () => void }

const meta: Meta<Args> = {
  title: 'Componentes/Sheet',
  component: 'robur-sheet',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { open: true, onClose: fn(), title: 'Semana 14' },
  decorators: [(story) => html`<div style="min-height: 20rem; padding: calc(var(--spacing) * 5)">${story()}</div>`],
  // `.title` como propiedad: el atributo `title` es también el del HTML y pintaría un aviso al pasar el ratón.
  render: (args) => html`<robur-sheet .title=${args.title} ?open=${args.open} @close=${args.onClose}>${content}</robur-sheet>`,
}

export default meta
type Story = StoryObj<Args>

export const Open: Story = {}

/** Comprueba el ciclo completo: se abre desde un botón, se cierra y el foco vuelve al botón que la abrió. */
export const Interaccion: Story = {
  args: { open: false },
  render: (args) => html`
    <robur-button @click=${(event: Event) => ((event.currentTarget as HTMLElement).nextElementSibling as RoburSheet).open = true}>Ver semana</robur-button>
    <robur-sheet .title=${args.title} @close=${(event: Event) => ((event.currentTarget as RoburSheet).open = false)}>${content}</robur-sheet>
  `,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('robur-button')!
    await userEvent.click(inside(canvasElement, 'robur-button').getByRole('button', { name: 'Ver semana' }))
    const sheet = inside(canvasElement, 'robur-sheet')
    const dialog = sheet.getByRole('dialog', { name: 'Semana 14' })
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.click(sheet.getByRole('button', { name: 'Cerrar' }))
    await waitFor(() => expect(dialog).not.toBeVisible())
    // El foco vuelve a <robur-button>: desde fuera del Shadow DOM, el foco está en la etiqueta.
    await expect(trigger).toHaveFocus()
  },
}
