import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburLineChart } from './line-chart'
import './line-chart'

type Args = Pick<RoburLineChart, 'title' | 'data' | 'variant' | 'series'>

const WEIGHTS = [
  { label: '05-10', value: 20 },
  { label: '12-10', value: 20 },
  { label: '19-10', value: 22.5 },
  { label: '26-10', value: 22.5 },
  { label: '02-11', value: 25 },
  { label: '09-11', value: 24 },
  { label: '16-11', value: 27.5 },
]

const meta: Meta<Args> = {
  title: 'Componentes/LineChart',
  component: 'robur-line-chart',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Press de hombro, peso (kg)', data: WEIGHTS },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  render: (args) => html`<robur-line-chart .title=${args.title} .data=${args.data} variant=${args.variant ?? 'surface'} series=${args.series ?? 'primary'}></robur-line-chart>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const SegundaSerie: Story = { args: { variant: 'inverse', series: 'secondary' } }

export const UnSoloRegistro: Story = { args: { data: WEIGHTS.slice(0, 1) } }

/** Comprueba que la gráfica tiene nombre y que los datos se pueden leer sin ver la línea. */
export const Lectura: Story = {
  play: async ({ canvasElement }) => {
    const canvas = inside(canvasElement, 'robur-line-chart')
    await expect(canvas.getByRole('figure', { name: 'Press de hombro, peso (kg)' })).toBeVisible()
    await expect(canvas.getByRole('row', { name: '16-11 27,5' })).toBeInTheDocument()
  },
}
