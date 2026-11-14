// Lee de un Web Component lo que su contrato describe: props, eventos y contenido.
// No lee el código a mano: usa custom-elements.json, el manifiesto que genera `npm run cem`
// a partir de los decoradores de Lit y de los comentarios (@fires, @slot).
//
// Cómo se corresponde un Web Component con el contrato, que es el mismo en todas las tecnologías:
// - una propiedad `@property()` pública   → una prop del contrato;
// - un evento `@fires completed-change`   → la prop función `onCompletedChange`;
// - el slot por defecto (`@slot -`)        → la prop `children`, de tipo node. Es opcional si
//   su descripción empieza por «Opcional»;
// - una propiedad o un evento que no está en el contrato y que es del elemento nativo que dice
//   `extends` (disabled, type, value, input, change…) → nada: el contrato lo da por heredado.
// Una prop es obligatoria cuando no tiene valor por defecto y su tipo no admite undefined
// (`label!: string`).
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { root } from './tokens.mjs'

const manifestFile = join(root, 'custom-elements.json')
let manifest
/** La declaración de una etiqueta en el manifiesto. */
export function declarationOf(tag) {
  manifest ??= JSON.parse(readFileSync(manifestFile, 'utf8'))
  for (const mod of manifest.modules) {
    for (const declaration of mod.declarations ?? []) if (declaration.tagName === tag) return declaration
  }
  return undefined
}

const capitalize = (text) => text[0].toUpperCase() + text.slice(1)
const camel = (text) => text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
export const eventToProp = (event) => `on${capitalize(camel(event))}`

function typeOf(text = '') {
  const parts = text.split('|').map((t) => t.trim()).filter((t) => t !== 'undefined')
  if (parts.length && parts.every((t) => /^'[^']*'$/.test(t))) return { type: 'enum', values: parts.map((t) => t.slice(1, -1)) }
  if (parts.length === 1 && /(\[\]|^Array<.+>|^readonly .+\[\])$/.test(parts[0])) return { type: 'array' }
  if (parts.length === 1 && ['boolean', 'string', 'number'].includes(parts[0])) return { type: parts[0] }
  return { type: parts.join(' | ') || 'unknown' }
}

function literal(text) {
  if (text === undefined) return undefined
  if (text === 'true' || text === 'false') return text === 'true'
  if (/^'.*'$|^".*"$/.test(text)) return text.slice(1, -1)
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text)
  return undefined
}

/**
 * Las props, los eventos y el contenido de una etiqueta, en la forma del contrato.
 * Cada elemento lleva `kind`: 'property', 'event' o 'content'.
 */
export function membersFromCode(tag) {
  const declaration = declarationOf(tag)
  if (!declaration) return []
  const out = []
  for (const member of declaration.members ?? []) {
    if (member.kind !== 'field' || member.static || member.privacy || member.name.startsWith('#')) continue
    const optional = (member.type?.text ?? '').split('|').some((t) => t.trim() === 'undefined')
    const prop = { name: member.name, ...typeOf(member.type?.text) }
    const value = literal(member.default)
    if (value !== undefined) prop.default = value
    else if (!optional) prop.required = true
    out.push({ kind: 'property', prop, description: member.description ?? '', attribute: member.attribute })
  }
  for (const event of declaration.events ?? []) {
    out.push({ kind: 'event', event: event.name, prop: { name: eventToProp(event.name), type: 'function' }, description: event.description ?? '' })
  }
  const slot = (declaration.slots ?? []).find((s) => s.name === '')
  if (slot) {
    const prop = { name: 'children', type: 'node' }
    if (!/^opcional/i.test(slot.description ?? '')) prop.required = true
    out.push({ kind: 'content', prop, description: slot.description ?? '' })
  }
  return out
}

// Los atributos y eventos de un elemento nativo salen de los tipos del DOM. TypeScript 7 ya no
// trae la API de JavaScript: se usa el TypeScript 5 del analizador del manifiesto.
const ts = createRequire(createRequire(import.meta.url).resolve('@custom-elements-manifest/analyzer'))('typescript')
const nativeCache = {}
/** Los nombres, en minúsculas, de las propiedades del elemento nativo `tag` (button, input…). */
export function nativeAttributes(tag) {
  if (nativeCache[tag]) return nativeCache[tag]
  const fileName = 'native.ts'
  const text = `export type Native = HTMLElementTagNameMap['${tag}']`
  const host = ts.createCompilerHost({})
  const original = { getSourceFile: host.getSourceFile, fileExists: host.fileExists, readFile: host.readFile }
  host.getSourceFile = (name, ...rest) => (name === fileName ? ts.createSourceFile(name, text, ts.ScriptTarget.ES2022, true) : original.getSourceFile(name, ...rest))
  host.fileExists = (name) => name === fileName || original.fileExists(name)
  host.readFile = (name) => (name === fileName ? text : original.readFile(name))
  const program = ts.createProgram([fileName], { lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'], noEmit: true, types: [] }, host)
  const checker = program.getTypeChecker()
  const alias = program.getSourceFile(fileName).statements[0]
  const names = checker.getTypeFromTypeNode(alias.type).getProperties().map((symbol) => symbol.name.toLowerCase())
  return (nativeCache[tag] = new Set(names))
}

/**
 * Las props propias del componente, en la forma del contrato, con el comentario de cada una.
 * `contract` decide qué propiedades y eventos son heredados del elemento nativo.
 */
export function propsFromCode(tag, contract) {
  const declared = new Set((contract.props ?? []).map((p) => p.name))
  const native = contract.extends ? nativeAttributes(contract.extends) : new Set()
  const out = []
  for (const member of membersFromCode(tag)) {
    const { kind, prop, description } = member
    const inherited = kind !== 'content' && !declared.has(prop.name) && native.has(prop.name.toLowerCase())
    if (inherited) continue
    out.push({ prop, description, event: kind === 'event' ? member.event : undefined })
  }
  return out
}

/** Las propiedades heredadas del elemento nativo que el componente deja pasar. */
export function nativeFromCode(tag, contract) {
  const own = new Set(propsFromCode(tag, contract).map(({ prop }) => prop.name))
  return membersFromCode(tag)
    .filter((m) => m.kind === 'property' && !own.has(m.prop.name))
    .map((m) => ({ name: m.prop.name, attribute: m.attribute }))
}
