import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import type { RoburCard } from './card'
import './card'

type Args = Pick<RoburCard, 'variant' | 'padding'>

const meta: Meta<Args> = {
  title: 'Componentes/Card',
  component: 'robur-card',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['surface', 'inverse'] },
    padding: { control: 'select', options: ['md', 'lg'] },
  },
  decorators: [(story) => html`<div style="width: 20rem">${story()}</div>`],
  render: (args) => html`
    <robur-card variant=${args.variant ?? 'surface'} padding=${args.padding ?? 'md'}>
      <p style="margin: 0; font-size: var(--text-title); font-weight: var(--text-title--font-weight)">Tu semana</p>
      <p style="margin: 0; font-size: var(--text-sm)">Tres sesiones completadas.</p>
    </robur-card>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Surface: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const PaddingLg: Story = { args: { padding: 'lg' } }
