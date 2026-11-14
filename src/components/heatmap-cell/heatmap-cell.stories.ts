import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import { shadowOf } from '../../stories/shadow'
import type { RoburHeatmapCell } from './heatmap-cell'
import './heatmap-cell'

type Args = Pick<RoburHeatmapCell, 'week' | 'sessions' | 'rest' | 'current' | 'disabled'>

const meta: Meta<Args> = {
  title: 'Componentes/HeatmapCell',
  component: 'robur-heatmap-cell',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { week: 14, sessions: 3 },
  decorators: [
    (story) => html`<div style="display: grid; width: 16rem; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: calc(var(--spacing) * 1)">${story()}</div>`,
  ],
  render: (args) => html`
    <robur-heatmap-cell week=${args.week} sessions=${args.sessions} ?rest=${args.rest} ?current=${args.current} ?disabled=${args.disabled}></robur-heatmap-cell>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const SinSesiones: Story = { args: { sessions: 0 } }

export const Rest: Story = { args: { rest: true, sessions: 0 } }

export const Current: Story = { args: { current: true } }

/** Los cinco niveles, el descanso y la semana en curso. Comprueba que cada celda dice su dato en texto. */
export const Niveles: Story = {
  render: () => html`
    ${[0, 1, 2, 3, 4].map((sessions) => html`<robur-heatmap-cell week=${10 + sessions} sessions=${sessions}></robur-heatmap-cell>`)}
    <robur-heatmap-cell week="15" sessions="0" rest></robur-heatmap-cell>
    <robur-heatmap-cell week="16" sessions="2" current></robur-heatmap-cell>
  `,
  play: async ({ canvasElement }) => {
    const cell = (week: number) => shadowOf(canvasElement.querySelector(`robur-heatmap-cell[week="${week}"]`)!)
    await expect(cell(11).getByRole('button', { name: 'Semana 11, 1 sesión' })).toBeVisible()
    await expect(cell(15).getByRole('button', { name: 'Semana 15, descanso' })).toBeVisible()
    await expect(cell(16).getByRole('button', { name: 'Semana 16, 2 sesiones, semana actual' })).toBeVisible()
  },
}
