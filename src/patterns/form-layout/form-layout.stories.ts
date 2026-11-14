import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html, type TemplateResult } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import '../../components/input'
import type { RoburFormLayout } from './form-layout'
import './form-layout'

// Las props y los eventos `submit` y `cancel`.
type Args = Pick<RoburFormLayout, 'title' | 'submitLabel' | 'cancelLabel' | 'submitting'> & {
  onSubmit: () => void
  onCancel: () => void
}

const form = (fields: TemplateResult) => (args: Args) => html`
  <robur-form-layout
    .title=${args.title}
    submit-label=${args.submitLabel}
    .cancelLabel=${args.cancelLabel}
    ?submitting=${args.submitting}
    @submit=${args.onSubmit}
    @cancel=${args.onCancel}
    >${fields}</robur-form-layout
  >
`

const meta: Meta<Args> = {
  title: 'Patrones/FormLayout',
  component: 'robur-form-layout',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Nuevo ejercicio',
    submitLabel: 'Guardar ejercicio',
    cancelLabel: 'Cancelar',
    onSubmit: fn(),
    onCancel: fn(),
  },
  render: form(html`
    <robur-input label="Nombre" placeholder="Press de hombro"></robur-input>
    <robur-input label="Series" numeric placeholder="0"></robur-input>
    <robur-input label="Repeticiones" numeric placeholder="0"></robur-input>
  `),
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const ConError: Story = {
  render: form(html`
    <robur-input label="Nombre" error="Escribe un nombre para el ejercicio."></robur-input>
    <robur-input label="Series" numeric value="3"></robur-input>
  `),
}

export const Enviando: Story = { args: { submitting: true } }

/** Comprueba que el formulario se envía con la tecla Intro desde un campo. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    // El campo está dentro de <robur-input>, que llega al formulario por el slot.
    await userEvent.type(inside(canvasElement, 'robur-input').getByLabelText('Nombre'), 'Sentadilla{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}
