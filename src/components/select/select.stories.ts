import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburSelect } from './select'
import './select'

type Args = Pick<RoburSelect, 'label' | 'options' | 'placeholder' | 'hint' | 'error' | 'disabled'>

const OPTIONS = [
  { value: 'press', label: 'Press de hombro' },
  { value: 'remo', label: 'Remo con mancuerna' },
  { value: 'sentadilla', label: 'Sentadilla goblet' },
]

const meta: Meta<Args> = {
  title: 'Componentes/Select',
  component: 'robur-select',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Ejercicio', options: OPTIONS, placeholder: 'Elige un ejercicio' },
  decorators: [(story) => html`<div style="width: 20rem">${story()}</div>`],
  render: (args) => html`
    <robur-select
      label=${args.label}
      .options=${args.options}
      .placeholder=${args.placeholder}
      .hint=${args.hint}
      .error=${args.error}
      ?disabled=${args.disabled}
    ></robur-select>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const WithHint: Story = { args: { hint: 'Solo aparecen los de la biblioteca.' } }

export const WithError: Story = { args: { error: 'Elige un ejercicio.' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que el campo se nombra por su etiqueta y que cambia al elegir. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const select = inside(canvasElement, 'robur-select').getByRole('combobox', { name: 'Ejercicio' })
    await userEvent.selectOptions(select, 'remo')
    await expect(select).toHaveValue('remo')
    await expect(canvasElement.querySelector('robur-select')!.value).toBe('remo')
  },
}
