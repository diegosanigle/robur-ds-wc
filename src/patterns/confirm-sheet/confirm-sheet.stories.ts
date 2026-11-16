import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburConfirmSheet } from './confirm-sheet'
import './confirm-sheet'

// Las props y los eventos `confirm` y `cancel`.
type Args = Pick<RoburConfirmSheet, 'open' | 'title' | 'description' | 'confirmLabel' | 'loading'> & { onConfirm: () => void; onCancel: () => void }

const meta: Meta<Args> = {
  title: 'Patrones/ConfirmSheet',
  component: 'robur-confirm-sheet',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    open: true,
    title: '¿Borrar esta sesión?',
    description: 'Se borran también sus ejercicios y deja de contar en el heatmap.',
    confirmLabel: 'Borrar sesión',
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => html`
    <robur-confirm-sheet
      ?open=${args.open}
      .title=${args.title}
      description=${args.description}
      confirm-label=${args.confirmLabel}
      ?loading=${args.loading}
      @confirm=${args.onConfirm}
      @cancel=${args.onCancel}
    ></robur-confirm-sheet>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Loading: Story = { args: { loading: true } }

/** Comprueba que confirmar y cancelar llaman cada uno a lo suyo. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    await expect(inside(canvasElement, 'robur-confirm-sheet', 'robur-sheet').getByRole('dialog', { name: '¿Borrar esta sesión?' })).toBeVisible()
    const [confirm, cancel] = canvasElement.querySelector('robur-confirm-sheet')!.shadowRoot!.querySelectorAll('robur-button')
    await userEvent.click(inside(confirm.shadowRoot!).getByRole('button', { name: 'Borrar sesión' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await userEvent.click(inside(cancel.shadowRoot!).getByRole('button', { name: 'Cancelar' }))
    await expect(args.onCancel).toHaveBeenCalled()
  },
}
