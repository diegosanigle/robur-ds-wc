import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburEmptyState } from './empty-state'
import './empty-state'

// Las props y el evento `action`.
type Args = Pick<RoburEmptyState, 'title' | 'description' | 'actionLabel'> & { onAction: () => void }

const meta: Meta<Args> = {
  title: 'Patrones/EmptyState',
  component: 'robur-empty-state',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Aún no hay sesiones esta semana',
    description: 'Cuando registres una, aparecerá aquí.',
    actionLabel: 'Registrar sesión',
    onAction: fn(),
  },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  render: (args) => html`
    <robur-empty-state .title=${args.title} description=${args.description} .actionLabel=${args.actionLabel} @action=${args.onAction}></robur-empty-state>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const SinAccion: Story = {
  args: { title: 'Ningún ejercicio coincide', description: 'Prueba con otro nombre.', actionLabel: undefined },
}

/** Comprueba que la acción se puede pulsar y avisa. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    await expect(inside(canvasElement, 'robur-empty-state').getByRole('heading', { name: 'Aún no hay sesiones esta semana' })).toBeVisible()
    await userEvent.click(inside(canvasElement, 'robur-empty-state', 'robur-button').getByRole('button', { name: 'Registrar sesión' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}
