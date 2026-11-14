// Las piezas del sistema (componentes o patrones) con sus nombres en las formas que usan los Web Components.
// El contrato conserva el nombre en PascalCase (Button.contract.json); la carpeta y los
// ficheros van en kebab-case (button/button.ts), y la etiqueta es robur-<carpeta>.
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './tokens.mjs'

export const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
export const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, letter) => letter.toUpperCase())

/** Cada carpeta de src/<folder>: { name: 'StatCard', slug: 'stat-card', file(sufijo) }. */
export function pieces(folder) {
  const dir = join(root, 'src', folder)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((slug) => !slug.startsWith('.'))
    .sort()
    .map((slug) => ({ name: pascal(slug), slug, file: (suffix) => join(dir, slug, suffix) }))
}
