// Comprueba que el contrato de cada componente dice lo mismo que su código.
// Uso: node scripts/check-contracts.mjs (después de npm run cem, que genera custom-elements.json)
import { existsSync, readFileSync } from 'node:fs'
import { cssOf, cssProblems, tokensIn } from './lib/css.mjs'
import { pascal, pieces } from './lib/pieces.mjs'
import { declarationOf, propsFromCode } from './lib/wc-meta.mjs'

const REQUIRED = ['name', 'description', 'useWhen', 'avoidWhen', 'props', 'states', 'tokens', 'composes', 'rules', 'accessibility']
const errors = []

const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())
const components = pieces('components')
for (const { name, slug, file } of components) {
  const fail = (message) => errors.push(`${name}: ${message}`)

  for (const suffix of [`${slug}.ts`, `${slug}.stories.ts`, `${name}.contract.json`, 'index.ts']) {
    if (!existsSync(file(suffix))) fail(`falta ${suffix}`)
  }
  if (!existsSync(file(`${name}.contract.json`)) || !existsSync(file(`${slug}.ts`))) continue

  const contract = JSON.parse(readFileSync(file(`${name}.contract.json`), 'utf8'))
  const code = readFileSync(file(`${slug}.ts`), 'utf8')
  const tag = `robur-${slug}`

  for (const key of REQUIRED) if (!(key in contract)) fail(`al contrato le falta "${key}"`)
  if (contract.name !== name) fail(`el contrato se llama "${contract.name}"`)

  // Nomenclatura: la clase y la etiqueta salen del nombre del contrato.
  if (!code.includes(`export class Robur${name} `)) fail(`la clase no se llama Robur${name}`)
  if (!code.includes(`@customElement('${tag}')`)) fail(`la etiqueta no es ${tag}`)
  if (!declarationOf(tag)) {
    fail(`${tag} no está en custom-elements.json: ejecuta npm run cem`)
    continue
  }

  // Props: mismos nombres, tipos, valores, obligatoriedad y valores por defecto.
  const fromCode = propsFromCode(tag, contract)
  const inContract = Object.fromEntries((contract.props ?? []).map((p) => [p.name, p]))
  for (const { prop, description, event } of fromCode) {
    let declared = inContract[prop.name]
    // Un evento no puede ser obligatorio: de una prop función solo se comparan el nombre y el tipo.
    if (declared && event) declared = { name: declared.name, type: declared.type }
    if (!declared) fail(`${event ? `el evento "${event}" (${prop.name})` : `la prop "${prop.name}"`} está en el código y no en el contrato`)
    else if (JSON.stringify(declared, Object.keys(declared).sort()) !== JSON.stringify(prop, Object.keys(prop).sort())) {
      fail(`la prop "${prop.name}" no coincide. Código: ${JSON.stringify(prop)} · Contrato: ${JSON.stringify(declared)}`)
    }
    if (!description) fail(`${prop.name === 'children' ? 'el slot (@slot -)' : event ? `el evento "${event}" (@fires)` : `la prop "${prop.name}"`} no tiene comentario en el código`)
  }
  for (const propName of Object.keys(inContract)) {
    if (!fromCode.some(({ prop }) => prop.name === propName)) fail(`la prop "${propName}" está en el contrato y no en el código`)
  }

  // CSS: ni primitivos, ni variables inventadas, ni colores a mano.
  const css = cssOf(code)
  for (const problem of cssProblems(css)) fail(problem)

  // Tokens: los que el CSS usa de verdad.
  const usedTokens = tokensIn(css)
  const declaredTokens = contract.tokens ?? []
  for (const token of usedTokens) if (!declaredTokens.includes(token)) fail(`usa el token ${token} y el contrato no lo declara`)
  for (const token of declaredTokens) if (!usedTokens.includes(token)) fail(`el contrato declara el token ${token} y el código no lo usa`)

  // Composición: los componentes del sistema que importa.
  const imported = [...code.matchAll(/import (?:[^'"]+ from )?'\.\.\/([\w-]+)'/g)].map((m) => pascal(m[1]))
  if (!same(new Set(imported), contract.composes ?? [])) fail(`importa [${imported}] y el contrato declara composes [${contract.composes}]`)

  // Una story por cada valor de variant.
  const stories = existsSync(file(`${slug}.stories.ts`)) ? readFileSync(file(`${slug}.stories.ts`), 'utf8') : ''
  const variant = fromCode.find(({ prop }) => prop.name === 'variant')?.prop
  for (const value of variant?.values ?? []) {
    if (value !== variant.default && !stories.includes(`variant: '${value}'`)) fail(`la variante "${value}" no tiene story`)
  }
}

if (errors.length) {
  console.error(`Contratos: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Contratos: ${components.length} componentes, todos coinciden con su código.`)
