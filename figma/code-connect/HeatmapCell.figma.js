// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-133
// source=src/components/heatmap-cell/heatmap-cell.ts
// component=robur-heatmap-cell
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const sessions = instance.getEnum('sessions', { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4 })
const rest = instance.getEnum('rest', { 'false': false, 'true': true })
const current = instance.getEnum('current', { 'false': false, 'true': true })

export default {
  example: figma.code`<robur-heatmap-cell${' .week=${week}' + ' sessions="' + sessions + '"' + (rest ? ' rest' : '') + (current ? ' current' : '')}></robur-heatmap-cell>`,
  imports: ['import "robur-ds"'],
  id: 'HeatmapCell',
  metadata: { nestable: true },
}
