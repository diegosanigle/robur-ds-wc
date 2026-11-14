import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html, svg } from 'lit'
import { expect } from 'storybook/test'
import { inside } from '../../stories/shadow'
import type { NavItem, RoburBottomNav } from './bottom-nav'
import './bottom-nav'

// Un icono es una plantilla de Lit: aquí, cinco SVG de un solo trazo.
const icon = (d: string) =>
  html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${svg`<path d=${d} />`}</svg>`

const ITEMS: NavItem[] = [
  { value: 'inicio', label: 'Inicio', href: '#inicio', icon: icon('M4 11l8-7 8 7v9H4z') },
  { value: 'sesion', label: 'Sesión', href: '#sesion', icon: icon('M4 12h16M7 8v8M17 8v8') },
  { value: 'plan', label: 'Plan', href: '#plan', icon: icon('M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01') },
  { value: 'progreso', label: 'Progreso', href: '#progreso', icon: icon('M4 19V5M4 19h16M8 15l4-5 3 3 4-6') },
  { value: 'ajustes', label: 'Ajustes', href: '#ajustes', icon: icon('M5 7h14M5 12h14M5 17h14') },
]

type Args = Pick<RoburBottomNav, 'label' | 'items' | 'value'>

const meta: Meta<Args> = {
  title: 'Componentes/BottomNav',
  component: 'robur-bottom-nav',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { items: ITEMS, value: 'inicio' },
  decorators: [(story) => html`<div style="width: 24rem">${story()}</div>`],
  render: (args) => html`<robur-bottom-nav label=${args.label ?? 'Principal'} .items=${args.items} value=${args.value}></robur-bottom-nav>`,
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const TresSecciones: Story = { args: { items: ITEMS.slice(0, 3) } }

/** Comprueba que solo la sección actual se anuncia como página actual. */
export const SeccionActual: Story = {
  args: { value: 'progreso' },
  play: async ({ canvasElement }) => {
    const nav = inside(canvasElement, 'robur-bottom-nav')
    await expect(nav.getByRole('link', { name: 'Progreso' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  },
}
