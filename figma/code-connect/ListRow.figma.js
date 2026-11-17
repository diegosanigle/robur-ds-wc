// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=46-279
// source=src/components/list-row/list-row.ts
// component=robur-list-row
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const detail = instance.getString('detail')
const value = instance.getString('value')
const onSelect = instance.getEnum('onSelect', { 'false': false, 'true': true })
const children = instance.getSlot('children')

export default {
  example: figma.code`<robur-list-row${' title="' + title + '"' + (detail ? ' detail="' + detail + '"' : '') + (value ? ' value="' + value + '"' : '') + (onSelect ? ' @select=${onSelect}' : '')}>
  ${children}
</robur-list-row>`,
  imports: ['import "robur-ds"'],
  id: 'ListRow',
  metadata: { nestable: true },
}
