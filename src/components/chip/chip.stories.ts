import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, userEvent } from 'storybook/test'
import { shadowOf } from '../../stories/shadow'
import type { RoburChip } from './chip'
import './chip'

type Args = Pick<RoburChip, 'variant' | 'selected' | 'disabled'> & {
  /** El texto de la opción (slot por defecto). */
  children: string
}

const meta: Meta<Args> = {
  title: 'Componentes/Chip',
  component: 'robur-chip',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Empuje' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'accent'] },
    children: { control: 'text', table: { category: 'slots' } },
  },
  render: (args) => html`
    <robur-chip variant=${args.variant ?? 'default'} ?selected=${args.selected} ?disabled=${args.disabled}>${args.children}</robur-chip>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Selected: Story = { args: { selected: true } }

export const Accent: Story = { args: { variant: 'accent', children: 'Nuevo' } }

export const Disabled: Story = { args: { disabled: true } }

const DAYS = ['Empuje', 'Tirón', 'Pierna']

/** Un grupo de chips para elegir el tipo de día. Comprueba que al pulsar cambia la selección. */
export const Interaccion: Story = {
  render: () => {
    const choose = (event: Event) => {
      const group = (event.currentTarget as HTMLElement).parentElement!
      for (const chip of group.querySelectorAll('robur-chip')) chip.selected = chip === event.currentTarget
    }
    return html`<div style="display: flex; gap: calc(var(--spacing) * 2)">
      ${DAYS.map((day) => html`<robur-chip ?selected=${day === 'Empuje'} @click=${choose}>${day}</robur-chip>`)}
    </div>`
  },
  play: async ({ canvasElement }) => {
    // Cada chip tiene su <button> dentro de su propio Shadow DOM.
    const chip = (name: string) => shadowOf([...canvasElement.querySelectorAll('robur-chip')].find((c) => c.textContent === name)!).getByRole('button')
    await userEvent.click(chip('Pierna'))
    await expect(chip('Pierna')).toHaveAttribute('aria-pressed', 'true')
    await expect(chip('Empuje')).toHaveAttribute('aria-pressed', 'false')
  },
}
