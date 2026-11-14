import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburButton } from './button'
import './button'

type Args = Pick<RoburButton, 'variant' | 'fullWidth' | 'loading' | 'type' | 'disabled'> & {
  /** El texto del botón (slot por defecto). */
  children: string
  onClick: (event: Event) => void
}

const meta: Meta<Args> = {
  title: 'Componentes/Button',
  component: 'robur-button',
  // `full-width` es el mismo dato que fullWidth: se deja una sola fila.
  parameters: { layout: 'centered', controls: { exclude: ['full-width'] } },
  tags: ['autodocs'],
  args: { children: 'Guardar sesión', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    children: { control: 'text', table: { category: 'slots' } },
  },
  render: (args) => html`
    <robur-button
      variant=${args.variant ?? 'primary'}
      ?full-width=${args.fullWidth}
      ?loading=${args.loading}
      ?disabled=${args.disabled}
      @click=${args.onClick}
      >${args.children}</robur-button
    >
  `,
}

export default meta
type Story = StoryObj<Args>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancelar' } }

export const Danger: Story = { args: { variant: 'danger', children: 'Borrar sesión' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true } }

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

/** Comprueba que un clic llama a `onClick` y que un botón deshabilitado no lo hace. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    // El <button> vive dentro del Shadow DOM de <robur-button>: se busca ahí.
    const button = inside(canvasElement, 'robur-button').getByRole('button', { name: 'Guardar sesión' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
