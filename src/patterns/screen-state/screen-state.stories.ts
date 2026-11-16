import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburScreenState } from './screen-state'
import './screen-state'

// Las props y el evento `retry`.
type Args = Pick<RoburScreenState, 'state' | 'message'> & { onRetry?: () => void }

const meta: Meta<Args> = {
  title: 'Patrones/ScreenState',
  component: 'robur-screen-state',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { state: 'loading' },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  // Con onRetry, la plantilla escucha `retry`; sin él, el error no ofrece reintento.
  render: (args) =>
    args.onRetry
      ? html`<robur-screen-state state=${args.state} .message=${args.message} @retry=${args.onRetry}></robur-screen-state>`
      : html`<robur-screen-state state=${args.state} .message=${args.message}></robur-screen-state>`,
}

export default meta
type Story = StoryObj<Args>

export const Loading: Story = {}

export const WithError: Story = { args: { state: 'error', onRetry: fn() } }

/** Comprueba que el error se anuncia y que Reintentar avisa. */
export const Interaccion: Story = {
  args: { state: 'error', message: 'No hay conexión. Vuelve a intentarlo cuando la tengas.', onRetry: fn() },
  play: async ({ canvasElement, args }) => {
    await expect(inside(canvasElement, 'robur-screen-state').getByRole('alert')).toHaveTextContent('No hay conexión')
    await userEvent.click(inside(canvasElement, 'robur-screen-state', 'robur-button').getByRole('button', { name: 'Reintentar' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
