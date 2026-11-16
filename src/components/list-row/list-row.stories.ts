import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { expect, fn, userEvent } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { RoburListRow } from './list-row'
import '../button'
import './list-row'

// Las props, el evento `select` y las acciones (slot por defecto).
type Args = Pick<RoburListRow, 'title' | 'detail' | 'value'> & { onSelect?: () => void; children?: TemplateResult }

const meta: Meta<Args> = {
  title: 'Componentes/ListRow',
  component: 'robur-list-row',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Press de hombro', detail: '3 × 12' },
  decorators: [(story) => html`<ul style="width: 24rem; margin: 0; padding: 0">${story()}</ul>`],
  // Con onSelect, la plantilla escucha `select`; sin él, la fila no es pulsable.
  render: (args) =>
    args.onSelect
      ? html`<robur-list-row .title=${args.title} .detail=${args.detail} .value=${args.value} @select=${args.onSelect}>${args.children ?? nothing}</robur-list-row>`
      : html`<robur-list-row .title=${args.title} .detail=${args.detail} .value=${args.value}>${args.children ?? nothing}</robur-list-row>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const WithValue: Story = { args: { title: 'Empuje', detail: undefined, value: '12' } }

export const Selectable: Story = { args: { title: 'Empuje', detail: 'Lun 9 nov · 6 ejercicios', onSelect: fn() } }

export const WithActions: Story = {
  args: { children: html`<robur-button variant="text">Editar</robur-button><robur-button variant="text">Quitar</robur-button>` },
}

/** Una lista de tres filas: la última no lleva línea debajo. */
export const Lista: Story = {
  render: () => html`
    <robur-list-row title="Empuje" detail="Lun 9 nov · 6 ejercicios" @select=${() => {}}></robur-list-row>
    <robur-list-row title="Tirón" detail="Mié 11 nov · 5 ejercicios" @select=${() => {}}></robur-list-row>
    <robur-list-row title="Pierna" detail="Vie 13 nov · 6 ejercicios" @select=${() => {}}></robur-list-row>
  `,
}

/** Comprueba que pulsar la fila llama a onSelect y que las acciones son botones aparte. */
export const Interaccion: Story = {
  args: { onSelect: fn(), children: html`<robur-button variant="text">Quitar</robur-button>` },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(inside(canvasElement, 'robur-list-row').getByRole('button', { name: /Press de hombro/ }))
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await expect(inside(canvasElement, 'robur-button').getByRole('button', { name: 'Quitar' })).toBeVisible()
  },
}
