import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import type { RoburStatCard } from './stat-card'
import './stat-card'

type Args = Pick<RoburStatCard, 'label' | 'value' | 'unit' | 'variant' | 'series'>

const meta: Meta<Args> = {
  title: 'Componentes/StatCard',
  component: 'robur-stat-card',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Sesiones este mes', value: '14' },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'inverse'] },
    series: { control: 'select', options: ['primary', 'secondary'] },
  },
  decorators: [(story) => html`<div style="width: 14rem">${story()}</div>`],
  render: (args) => html`
    <robur-stat-card
      label=${args.label}
      value=${args.value}
      unit=${args.unit ?? ''}
      variant=${args.variant ?? 'surface'}
      series=${args.series ?? 'primary'}
    ></robur-stat-card>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Surface: Story = {}

export const ConUnidad: Story = { args: { label: 'Volumen semanal', value: '2.480', unit: 'kg' } }

export const Inverse: Story = { args: { variant: 'inverse' } }

export const InverseSecondary: Story = {
  args: { variant: 'inverse', series: 'secondary', label: 'Peso máximo', value: '62,5', unit: 'kg' },
}
