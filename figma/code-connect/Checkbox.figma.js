// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-92
// source=src/components/checkbox/checkbox.ts
// component=robur-checkbox
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const hint = instance.getString('hint')
const state = instance.getEnum('state', { 'default': 'default', 'checked': 'checked', 'disabled': 'disabled' })

export default {
  example: figma.code`<robur-checkbox${' label="' + label + '"' + (hint ? ' hint="' + hint + '"' : '') + (state === 'checked' ? ' checked' : '') + (state === 'disabled' ? ' disabled' : '')}></robur-checkbox>`,
  imports: ['import "robur-ds"'],
  id: 'Checkbox',
  metadata: { nestable: true },
}
