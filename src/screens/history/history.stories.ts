import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { HistorySession, HistorySummary, RoburHistory } from './history'
import './history'

const SESSIONS: HistorySession[] = [
  { id: '1', date: 'Lun 9 nov', dayType: 'Empuje', detail: '5 ejercicios · 1.240 kg' },
  { id: '2', date: 'Mié 4 nov', dayType: 'Pierna', detail: '4 ejercicios · 1.860 kg' },
  { id: '3', date: 'Lun 2 nov', dayType: 'Tirón', detail: '5 ejercicios · 980 kg' },
]
const SUMMARY: HistorySummary = { sessions: '3', volume: '4.080', maxWeight: '62,5' }
const EMPTY: HistorySummary = { sessions: '0', volume: '0', maxWeight: '0' }

// Las props y los eventos `period-change` y `log-session`.
type Args = Pick<RoburHistory, 'period' | 'summary' | 'sessions'> & {
  onPeriodChange: (period: string) => void
  onLogSession: () => void
}

const meta: Meta<Args> = {
  title: 'Pantallas/Historial',
  component: 'robur-history',
  parameters: { layout: 'fullscreen' },
  args: {
    period: 'mes',
    onPeriodChange: fn(),
    onLogSession: fn(),
    summary: SUMMARY,
    sessions: SESSIONS,
  },
  render: (args) => html`
    <robur-history
      period=${args.period}
      .summary=${args.summary}
      .sessions=${args.sessions}
      @period-change=${(event: CustomEvent<string>) => args.onPeriodChange(event.detail)}
      @log-session=${args.onLogSession}
    ></robur-history>
  `,
}

export default meta
type Story = StoryObj<Args>

export const ConSesiones: Story = {}

export const SinSesiones: Story = {
  args: { period: 'semana', summary: EMPTY, sessions: [] },
}

/** Comprueba que se puede cambiar de periodo y que un periodo sin sesiones ofrece registrar una. */
export const CambioDePeriodo: Story = {
  render: (args) => html`
    <robur-history
      period="mes"
      .summary=${SUMMARY}
      .sessions=${SESSIONS}
      @period-change=${(event: CustomEvent<string>) => {
        const history = event.currentTarget as RoburHistory
        history.period = event.detail
        history.sessions = event.detail === 'semana' ? [] : SESSIONS
        history.summary = event.detail === 'semana' ? EMPTY : SUMMARY
      }}
      @log-session=${args.onLogSession}
    ></robur-history>
  `,
  play: async ({ canvasElement, args }) => {
    const history = canvasElement.querySelector('robur-history')!
    await userEvent.click(inside(history.shadowRoot!, 'robur-tabs').getByRole('tab', { name: 'Semana' }))
    await history.updateComplete
    await userEvent.click(inside(history.shadowRoot!, 'robur-empty-state', 'robur-button').getByRole('button', { name: 'Registrar sesión' }))
    await expect(args.onLogSession).toHaveBeenCalledOnce()
  },
}
