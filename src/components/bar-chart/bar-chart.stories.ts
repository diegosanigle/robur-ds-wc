import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburBarChart } from './bar-chart'
import './bar-chart'

type Args = Pick<RoburBarChart, 'title' | 'data' | 'variant' | 'series'>

const WEEKS = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((week, i) => ({
  label: String(week),
  value: [2, 3, 1.5, 0, 2.5, 3, 4, 2, 1, 3.5, 2.75, 1][i],
}))

const meta: Meta<Args> = {
  title: 'Componentes/BarChart',
  component: 'robur-bar-chart',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Volumen semanal, últimas 12 semanas', data: WEEKS },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  render: (args) => html`<robur-bar-chart .title=${args.title} .data=${args.data} variant=${args.variant ?? 'surface'} series=${args.series ?? 'primary'}></robur-bar-chart>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const SegundaSerie: Story = { args: { variant: 'inverse', series: 'secondary' } }

/** Comprueba que la gráfica tiene nombre y que los datos se pueden leer sin ver las barras. */
export const Lectura: Story = {
  play: async ({ canvasElement }) => {
    const canvas = inside(canvasElement, 'robur-bar-chart')
    await expect(canvas.getByRole('figure', { name: 'Volumen semanal, últimas 12 semanas' })).toBeVisible()
    await expect(canvas.getByRole('row', { name: '41 4' })).toBeInTheDocument()
    await expect(canvas.getByRole('row', { name: '45 2,8' })).toBeInTheDocument()
  },
}
