import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import { inside } from '../../stories/shadow'
import { ICONS } from './icon'
import type { RoburIcon } from './icon'
import './icon'

type Args = Pick<RoburIcon, 'name' | 'size' | 'label'>

const meta: Meta<Args> = {
  title: 'Componentes/Icon',
  component: 'robur-icon',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'home' },
  render: (args) => html`<robur-icon name=${args.name} size=${args.size ?? 'md'} .label=${args.label}></robur-icon>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

/** El juego completo, en su tamaño mayor. */
export const Juego: Story = {
  render: () => html`
    <ul style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: calc(var(--spacing) * 6); margin: 0; padding: 0; list-style: none">
      ${Object.keys(ICONS).map(
        (name) => html`<li style="display: flex; flex-direction: column; align-items: center; gap: calc(var(--spacing) * 2); color: var(--text-color-tertiary); font-size: var(--text-label)">
          <robur-icon name=${name} size="lg" style="color: var(--text-color-primary)"></robur-icon>${name}
        </li>`,
      )}
    </ul>
  `,
}

/** Con label se anuncia como imagen; sin él, queda oculto a los lectores de pantalla. */
export const ConNombre: Story = {
  args: { name: 'check', label: 'Hecho' },
  play: async ({ canvasElement }) => {
    await expect(inside(canvasElement, 'robur-icon').getByRole('img', { name: 'Hecho' })).toBeVisible()
  },
}
