import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent, within } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburHeatmapYear } from './heatmap-year'
import './heatmap-year'

// Las props y el evento `week-select`.
type Args = Pick<RoburHeatmapYear, 'year' | 'weeks'> & { onWeekSelect: (event: CustomEvent<number>) => void }

// Un año de muestra: el dato de cada semana sale de una fórmula fija para que la story no cambie.
const year = (total: number, current: number) =>
  Array.from({ length: total }, (_, i) => {
    const week = i + 1
    if (week > current) return { week, sessions: 0 }
    return { week, sessions: (week * 7) % 5, rest: week === 20 || week === 33, current: week === current }
  })

const meta: Meta<Args> = {
  title: 'Componentes/HeatmapYear',
  component: 'robur-heatmap-year',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { year: 2026, weeks: year(53, 46), onWeekSelect: fn() },
  decorators: [
    (story) =>
      html`<div style="width: 24rem; border-radius: var(--radius-xl); background: var(--background-color-surface); padding: calc(var(--spacing) * 6)">${story()}</div>`,
  ],
  render: (args) => html`<robur-heatmap-year year=${args.year} .weeks=${args.weeks} @week-select=${args.onWeekSelect}></robur-heatmap-year>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const CincuentaYDosSemanas: Story = { args: { year: 2027, weeks: year(52, 3) } }

/** Comprueba que la rejilla tiene nombre y que pulsar una semana avisa con su número. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const year = canvasElement.querySelector('robur-heatmap-year')!
    const grid = inside(canvasElement, 'robur-heatmap-year').getByRole('group', { name: 'Semanas de 2026' })
    const cells = [...grid.querySelectorAll('robur-heatmap-cell')]
    await expect(cells).toHaveLength(53)
    await userEvent.click(within(cells[13].shadowRoot as unknown as HTMLElement).getByRole('button', { name: /^Semana 14,/ }))
    await expect(args.onWeekSelect).toHaveBeenCalledOnce()
    await expect((args.onWeekSelect as unknown as { mock: { calls: CustomEvent<number>[][] } }).mock.calls[0][0].detail).toBe(14)
    await expect(year.weeks).toHaveLength(53)
  },
}
