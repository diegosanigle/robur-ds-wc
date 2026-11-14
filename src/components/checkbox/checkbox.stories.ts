import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburCheckbox } from './checkbox'
import './checkbox'

type Args = Pick<RoburCheckbox, 'label' | 'hint' | 'checked' | 'disabled'>

const meta: Meta<Args> = {
  title: 'Componentes/Checkbox',
  component: 'robur-checkbox',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Flexiones' },
  render: (args) => html`
    <robur-checkbox label=${args.label} hint=${args.hint ?? ''} ?checked=${args.checked} ?disabled=${args.disabled}></robur-checkbox>
  `,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Checked: Story = { args: { checked: true } }

export const ConDetalle: Story = { args: { hint: '3 series × 12 reps' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que se puede marcar pulsando la etiqueta, no solo la casilla. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const box = inside(canvasElement, 'robur-checkbox')
    await userEvent.click(box.getByText('Flexiones'))
    await expect(box.getByRole('checkbox', { name: 'Flexiones' })).toBeChecked()
    await expect(canvasElement.querySelector('robur-checkbox')!.checked).toBe(true)
  },
}
