// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-53
// source=src/components/card/card.ts
// component=robur-card
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { 'surface': 'surface', 'inverse': 'inverse' })
const padding = instance.getEnum('padding', { 'md': 'md', 'lg': 'lg' })
const children = instance.getSlot('children')

export default {
  example: figma.code`<robur-card${(variant !== 'surface' ? ' variant="' + variant + '"' : '') + (padding !== 'md' ? ' padding="' + padding + '"' : '')}>
  ${children}
</robur-card>`,
  imports: ['import "robur-ds"'],
  id: 'Card',
  metadata: { nestable: true },
}
