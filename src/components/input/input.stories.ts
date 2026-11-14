import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html, nothing } from 'lit'
import { expect, userEvent, within } from 'storybook/test'
import type { RoburInput } from './input'
import './input'

type Args = Pick<RoburInput, 'label' | 'hint' | 'error' | 'numeric' | 'placeholder' | 'disabled'>

const meta: Meta<Args> = {
  title: 'Componentes/Input',
  component: 'robur-input',
  // `readonly` es el mismo dato que readOnly: se deja una sola fila.
  parameters: { layout: 'centered', controls: { exclude: ['readonly'] } },
  tags: ['autodocs'],
  args: { label: 'Nombre del ejercicio', placeholder: 'Press de hombro' },
  decorators: [(story) => html`<div style="width: 20rem">${story()}</div>`],
  render: (args) => html`
    <robur-input
      label=${args.label}
      hint=${args.hint ?? nothing}
      error=${args.error ?? nothing}
      placeholder=${args.placeholder ?? nothing}
      ?numeric=${args.numeric}
      ?disabled=${args.disabled}
    ></robur-input>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const ConAyuda: Story = { args: { hint: 'Tal y como aparecerá en tu biblioteca.' } }

export const ConError: Story = { args: { error: 'Escribe un nombre para el ejercicio.' } }

export const Numerico: Story = { args: { label: 'Peso (kg)', numeric: true, placeholder: '0' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que la etiqueta está asociada al campo y que se puede escribir en él. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    // La etiqueta y el campo viven dentro del Shadow DOM de <robur-input>: se buscan ahí.
    const host = canvasElement.querySelector('robur-input')!
    const input = within(host.shadowRoot as unknown as HTMLElement).getByLabelText('Nombre del ejercicio')
    await userEvent.type(input, 'Sentadilla')
    await expect(input).toHaveValue('Sentadilla')
    // El valor también llega a la etiqueta, como en un <input> nativo.
    await expect(host.value).toBe('Sentadilla')
  },
}
