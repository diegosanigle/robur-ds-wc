// Comprueba los patrones: que solo combinan componentes del sistema y que su contrato dice la verdad.
// Uso: node scripts/check-patterns.mjs (después de npm run cem)
import { existsSync, readFileSync } from 'node:fs'
import { cssOf, cssProblems } from './lib/css.mjs'
import { pascal, pieces } from './lib/pieces.mjs'
import { declarationOf, propsFromCode } from './lib/wc-meta.mjs'

const REQUIRED = ['name', 'description', 'useWhen', 'avoidWhen', 'props', 'components', 'rules', 'accessibility']
// Un patrón no dibuja controles: los pone el sistema.
const RAW = ['button', 'input', 'select', 'textarea', 'a', 'dialog']
// Ni decide el aspecto de las superficies: fondos, bordes, radios y sombras son de los componentes.
const SURFACE = /(?<![\w-])(background|border|box-shadow|outline)[\w-]*\s*:/
const errors = []
const patterns = pieces('patterns')
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())

for (const { name, slug, file } of patterns) {
  const fail = (message) => errors.push(`${name}: ${message}`)
  for (const suffix of [`${slug}.ts`, `${slug}.stories.ts`, `${name}.pattern.json`, 'index.ts']) {
    if (!existsSync(file(suffix))) fail(`falta ${suffix}`)
  }
  if (!existsSync(file(`${name}.pattern.json`)) || !existsSync(file(`${slug}.ts`))) continue

  const contract = JSON.parse(readFileSync(file(`${name}.pattern.json`), 'utf8'))
  const code = readFileSync(file(`${slug}.ts`), 'utf8')
  const tag = `robur-${slug}`

  for (const key of REQUIRED) if (!(key in contract)) fail(`al contrato le falta "${key}"`)
  if (contract.name !== name) fail(`el contrato se llama "${contract.name}"`)
  if (!code.includes(`export class Robur${name} `)) fail(`la clase no se llama Robur${name}`)
  if (!code.includes(`@customElement('${tag}')`)) fail(`la etiqueta no es ${tag}`)

  const imported = [...code.matchAll(/import (?:[^'"]+ from )?'\.\.\/\.\.\/components\/([\w-]+)'/g)].map((m) => pascal(m[1]))
  if (!same(imported, contract.components ?? [])) fail(`importa [${imported}] y el contrato declara components [${contract.components}]`)
  if (!imported.length) fail('no usa ningún componente del sistema')

  // La plantilla: lo que hay dentro de html`…`.
  const template = [...code.matchAll(/\bhtml`([\s\S]*?)`/g)].map((m) => m[1]).join('\n')
  for (const raw of RAW) if (new RegExp(`<${raw}[\\s>]`).test(template)) fail(`dibuja un <${raw}> propio: usa el componente del sistema`)
  const css = cssOf(code)
  const surface = SURFACE.exec(css)
  if (surface) fail(`su CSS usa "${surface[0]}": fondos, bordes, radios y sombras los ponen los componentes`)
  for (const problem of cssProblems(css)) fail(problem)

  if (!declarationOf(tag)) {
    fail(`${tag} no está en custom-elements.json: ejecuta npm run cem`)
    continue
  }
  // Props, eventos (onX) y slot (children), con los nombres neutros del contrato.
  const fromCode = propsFromCode(tag, contract)
  const inCode = fromCode.map(({ prop }) => prop.name)
  if (!same(inCode, (contract.props ?? []).map((p) => p.name))) fail(`las props del código [${inCode}] no coinciden con las del contrato`)
  for (const { prop, description } of fromCode) if (!description) fail(`"${prop.name}" no tiene comentario`)
}

if (errors.length) {
  console.error(`Patrones: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Patrones: ${patterns.length} patrones, todos combinan solo componentes del sistema.`)
