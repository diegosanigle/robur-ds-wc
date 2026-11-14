// Lee el sistema entero (componentes, patrones y sus contratos) para los generadores:
// el catálogo, la documentación y, más adelante, el MCP.
import { existsSync, readFileSync } from 'node:fs'
import { kebab, pieces } from './pieces.mjs'
import { membersFromCode, nativeFromCode, propsFromCode } from './wc-meta.mjs'

function read(kind, folder, suffix) {
  return pieces(folder)
    .filter(({ name, file }) => existsSync(file(`${name}.${suffix}.json`)))
    .map(({ name, slug, file }) => {
      const contract = JSON.parse(readFileSync(file(`${name}.${suffix}.json`), 'utf8'))
      const tag = `robur-${slug}`
      const stories = readFileSync(file(`${slug}.stories.ts`), 'utf8')
      const title = /title: '([^']+)'/.exec(stories)[1]
      const own = propsFromCode(tag, contract)
      const members = membersFromCode(tag)
      return {
        ...contract,
        kind,
        // Cómo se escribe en Web Components: carpeta y ficheros en kebab-case, etiqueta con el prefijo.
        slug,
        tag,
        className: `Robur${name}`,
        path: `src/${folder}/${slug}`,
        // Las descripciones de las props viven en el código: aquí se juntan con el contrato.
        propDocs: Object.fromEntries(own.map(({ prop, description }) => [prop.name, description ?? ''])),
        // Cómo se escribe cada prop en HTML: el atributo, o nada si solo es propiedad (listas).
        attributes: Object.fromEntries(members.filter((m) => m.kind === 'property').map((m) => [m.prop.name, m.attribute ?? null])),
        // El nombre del evento de cada prop función: onCompletedChange → completed-change.
        events: Object.fromEntries(own.filter(({ event }) => event).map(({ prop, event }) => [prop.name, event])),
        // Las propiedades que no están en el contrato: los atributos del elemento nativo que la pieza deja pasar.
        native: nativeFromCode(tag, contract),
        stories: [...stories.matchAll(/^export const (\w+)/gm)].map((m) => ({
          name: m[1],
          id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--${kebab(m[1])}`,
        })),
      }
    })
}

export const components = read('component', 'components', 'contract')
export const patterns = read('pattern', 'patterns', 'pattern')
