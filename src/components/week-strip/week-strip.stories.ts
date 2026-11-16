import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburWeekStrip } from './week-strip'
import './week-strip'

type Args = Pick<RoburWeekStrip, 'days'>

const NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const week = (done: number[], current: number) =>
  NAMES.map((name, i) => ({ name, label: LETTERS[i], done: done.includes(i), current: i === current }))

const meta: Meta<Args> = {
  title: 'Componentes/WeekStrip',
  component: 'robur-week-strip',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { days: week([0, 2], 3) },
  decorators: [
    (story) =>
      html`<div style="width: 24rem; border-radius: var(--radius-lg); background: var(--background-color-inverse); padding: calc(var(--spacing) * 6)">${story()}</div>`,
  ],
  render: (args) => html`<robur-week-strip .days=${args.days}></robur-week-strip>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const SinSesiones: Story = { args: { days: week([], 0) } }

/** Comprueba que cada día dice en texto si tuvo sesión y cuál es hoy. */
export const Lectura: Story = {
  play: async ({ canvasElement }) => {
    const items = inside(canvasElement, 'robur-week-strip').getAllByRole('listitem')
    await expect(items).toHaveLength(7)
    await expect(items[0]).toHaveTextContent('lunes, con sesión')
    await expect(items[1]).toHaveTextContent('martes')
    await expect(items[1]).not.toHaveTextContent('con sesión')
    await expect(items[3]).toHaveTextContent('jueves, hoy')
  },
}
