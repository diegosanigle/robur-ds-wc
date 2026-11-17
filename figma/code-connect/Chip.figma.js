// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-44
// source=src/components/chip/chip.ts
// component=robur-chip
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { 'default': 'default', 'accent': 'accent' })
const selected = instance.getEnum('selected', { 'false': false, 'true': true })
const children = instance.getString('children')
const state = instance.getEnum('state', { 'default': 'default', 'disabled': 'disabled' })

export default {
  example: figma.code`<robur-chip${(variant !== 'default' ? ' variant="' + variant + '"' : '') + (selected ? ' selected' : '') + (state === 'disabled' ? ' disabled' : '')}>${children}</robur-chip>`,
  imports: ['import "robur-ds"'],
  id: 'Chip',
  metadata: { nestable: true },
}
