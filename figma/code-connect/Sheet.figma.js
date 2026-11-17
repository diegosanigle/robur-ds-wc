// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=3-85
// source=src/components/sheet/sheet.ts
// component=robur-sheet
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const children = instance.getSlot('children')

export default {
  example: figma.code`<robur-sheet${' .open=${open}' + ' @close=${onClose}' + ' title="' + title + '"'}>
  ${children}
</robur-sheet>`,
  imports: ['import "robur-ds"'],
  id: 'Sheet',
  metadata: { nestable: true },
}
