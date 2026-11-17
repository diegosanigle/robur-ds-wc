// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-27
// source=src/components/button/button.ts
// component=robur-button
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { 'primary': 'primary', 'secondary': 'secondary', 'danger': 'danger', 'text': 'text' })
const loading = instance.getEnum('loading', { 'false': false, 'true': true })
const children = instance.getString('children')
const state = instance.getEnum('state', { 'default': 'default', 'disabled': 'disabled' })

export default {
  example: figma.code`<robur-button${(variant !== 'primary' ? ' variant="' + variant + '"' : '') + (loading ? ' loading' : '') + (state === 'disabled' ? ' disabled' : '')}>${children}</robur-button>`,
  imports: ['import "robur-ds"'],
  id: 'Button',
  metadata: { nestable: true },
}
