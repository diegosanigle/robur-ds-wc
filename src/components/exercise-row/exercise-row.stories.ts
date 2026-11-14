import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import '../input'
import type { RoburExerciseRow } from './exercise-row'
import './exercise-row'

const fields = html`
  <robur-input numeric label="Series" value="3"></robur-input>
  <robur-input numeric label="Reps" value="12"></robur-input>
  <robur-input numeric label="Peso (kg)" value="20"></robur-input>
`

// Las props y el evento `completed-change`.
type Args = Pick<RoburExerciseRow, 'name' | 'target' | 'completed'> & {
  onCompletedChange: (completed: boolean) => void
}

const meta: Meta<Args> = {
  title: 'Componentes/ExerciseRow',
  component: 'robur-exercise-row',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'Press de hombro', target: '3 series × 12 reps', completed: false, onCompletedChange: fn() },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  render: (args) => html`
    <robur-exercise-row
      name=${args.name}
      target=${args.target ?? ''}
      ?completed=${args.completed}
      @completed-change=${(event: CustomEvent<boolean>) => {
        ;(event.currentTarget as RoburExerciseRow).completed = event.detail
        args.onCompletedChange(event.detail)
      }}
      >${fields}</robur-exercise-row
    >
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Completed: Story = { args: { completed: true } }

export const SinCampos: Story = {
  args: { name: 'Plancha', target: '60 s' },
  render: (args) => html`<robur-exercise-row name=${args.name} target=${args.target ?? ''} ?completed=${args.completed}></robur-exercise-row>`,
}

/** Comprueba que marcar el ejercicio avisa con el nuevo estado. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    // La casilla está dentro de <robur-checkbox>, que está dentro de <robur-exercise-row>.
    const checkbox = inside(canvasElement, 'robur-exercise-row', 'robur-checkbox').getByRole('checkbox', { name: 'Press de hombro' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(args.onCompletedChange).toHaveBeenCalledWith(true)
  },
}
