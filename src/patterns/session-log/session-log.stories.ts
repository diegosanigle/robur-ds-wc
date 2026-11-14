import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside, shadowOf } from '../../stories/shadow'
import type { RoburSessionLog, SessionExercise } from './session-log'
import './session-log'

const PLAN: Record<string, { id: string; name: string; target: string }[]> = {
  Empuje: [
    { id: 'press', name: 'Press de hombro', target: '3 series × 12 reps' },
    { id: 'flexiones', name: 'Flexiones', target: '3 series × 15 reps' },
  ],
  Tirón: [{ id: 'remo', name: 'Remo con banda', target: '3 series × 12 reps' }],
  Pierna: [{ id: 'sentadilla', name: 'Sentadilla', target: '4 series × 10 reps' }],
}

const build = (dayType: string, done: string[]): SessionExercise[] =>
  PLAN[dayType].map((exercise) => ({ ...exercise, completed: done.includes(exercise.id) }))

// Las props y los eventos `day-type-change`, `exercise-change` y `save`.
type Args = Pick<RoburSessionLog, 'dayTypes' | 'dayType' | 'exercises' | 'saving'> & {
  onDayTypeChange: (dayType: string) => void
  onExerciseChange: (change: { id: string; completed: boolean }) => void
  onSave: () => void
}

const meta: Meta<Args> = {
  title: 'Patrones/SessionLog',
  component: 'robur-session-log',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    dayTypes: Object.keys(PLAN),
    dayType: 'Empuje',
    exercises: build('Empuje', []),
    onDayTypeChange: fn(),
    onExerciseChange: fn(),
    onSave: fn(),
  },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  render: (args) => html`
    <robur-session-log
      .dayTypes=${args.dayTypes}
      day-type=${args.dayType}
      .exercises=${args.exercises}
      ?saving=${args.saving}
      @day-type-change=${(event: CustomEvent<string>) => args.onDayTypeChange(event.detail)}
      @exercise-change=${(event: CustomEvent<{ id: string; completed: boolean }>) => args.onExerciseChange(event.detail)}
      @save=${args.onSave}
    ></robur-session-log>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Guardando: Story = { args: { saving: true } }

/** Comprueba la regla de los tres toques: tipo de día, ejercicio hecho y guardar. */
export const TresToques: Story = {
  render: (args) => {
    let done: string[] = []
    const log = (event: Event) => event.currentTarget as RoburSessionLog
    return html`
      <robur-session-log
        .dayTypes=${args.dayTypes}
        day-type="Empuje"
        .exercises=${build('Empuje', [])}
        @day-type-change=${(event: CustomEvent<string>) => {
          log(event).dayType = event.detail
          log(event).exercises = build(event.detail, done)
        }}
        @exercise-change=${(event: CustomEvent<{ id: string; completed: boolean }>) => {
          const { id, completed } = event.detail
          done = completed ? [...done, id] : done.filter((d) => d !== id)
          log(event).exercises = build(log(event).dayType, done)
        }}
        @save=${args.onSave}
      ></robur-session-log>
    `
  },
  play: async ({ canvasElement, args }) => {
    const log = canvasElement.querySelector('robur-session-log')!
    const chip = [...log.shadowRoot!.querySelectorAll('robur-chip')].find((c) => c.textContent === 'Pierna')!
    await userEvent.click(shadowOf(chip).getByRole('button', { name: 'Pierna' }))
    await log.updateComplete
    const checkbox = () => inside(log.shadowRoot!, 'robur-exercise-row', 'robur-checkbox').getByRole('checkbox', { name: 'Sentadilla' })
    await userEvent.click(checkbox())
    await userEvent.click(inside(log.shadowRoot!, 'robur-button').getByRole('button', { name: 'Guardar sesión' }))
    await expect(checkbox()).toBeChecked()
    await expect(args.onSave).toHaveBeenCalledOnce()
  },
}
