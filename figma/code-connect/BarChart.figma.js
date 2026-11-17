// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=47-284
// source=src/components/bar-chart/bar-chart.ts
// component=robur-bar-chart
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const variant = instance.getEnum('variant', { 'surface': 'surface', 'inverse': 'inverse' })
const series = instance.getEnum('series', { 'primary': 'primary', 'secondary': 'secondary' })

export default {
  example: figma.code`<robur-bar-chart${' title="' + title + '"' + ' .data=${data}' + (variant !== 'surface' ? ' variant="' + variant + '"' : '') + (series !== 'primary' ? ' series="' + series + '"' : '')}></robur-bar-chart>`,
  imports: ['import "robur-ds"'],
  id: 'BarChart',
  metadata: { nestable: true },
}
