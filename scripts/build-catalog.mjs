// Genera docs/catalogo.md: el índice del sistema en una página.
// Es lo primero que lee un agente: qué hay y para qué sirve. El detalle está en cada contrato.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components, patterns } from './lib/system.mjs'
import { cssVariable, primitives, root, themes, typography } from './lib/tokens.mjs'

const props = (c) =>
  c.props
    .filter((p) => p.type !== 'function')
    .map((p) => `\`${p.name}\`${p.type === 'enum' ? ` (${p.values.join(' · ')})` : ''}`)
    .join(', ')

const groups = {}
for (const name of Object.keys(themes.light)) (groups[name.split('.')[1]] ??= []).push(name)
const GROUP = { text: 'Texto', bg: 'Fondos', border: 'Bordes', focus: 'Foco', heat: 'Heatmap', data: 'Datos' }

const out = `<!-- GENERADO por scripts/build-catalog.mjs. No editar a mano. -->
# Catálogo de Robur DS

Todo lo que existe en el sistema. Si algo no está aquí, no existe: no lo inventes, proponlo.

## Patrones

Empieza por aquí: si un patrón resuelve la pantalla, úsalo antes de combinar componentes.

| Patrón | Etiqueta | Qué resuelve | Detalle |
|---|---|---|---|
${patterns.map((p) => `| \`${p.name}\` | \`<${p.tag}>\` | ${p.description} | \`${p.path}/${p.name}.pattern.json\` |`).join('\n')}

## Componentes

| Componente | Etiqueta | Qué es | Props | Detalle |
|---|---|---|---|---|
${components.map((c) => `| \`${c.name}\` | \`<${c.tag}>\` | ${c.description} | ${props(c)} | \`${c.path}/${c.name}.contract.json\` |`).join('\n')}

Antes de usar un componente, lee su contrato: \`useWhen\`, \`avoidWhen\` y \`rules\` dicen cuándo y cómo.

Cada pieza es una etiqueta del navegador. Se registra al importar \`src/index.ts\` (o la carpeta de la pieza) y se escribe en HTML:

- Una prop es un atributo en kebab-case: \`fullWidth\` se escribe \`full-width\`. Las listas (\`items\`, \`tabs\`, \`exercises\`) solo se pasan como propiedad: \`.items=\${…}\` en una plantilla de Lit.
- Una prop de tipo función del contrato es un evento con el nombre en kebab-case: \`onCompletedChange\` es \`completed-change\`. El dato llega en \`event.detail\`.
- La prop \`children\` es lo que va entre las etiquetas.

## Tokens

Variables CSS disponibles. Se usan con \`var()\` en el CSS de un componente; no existe ningún otro color, radio, sombra o tamaño de texto.

| Para | Variables |
|---|---|
${Object.entries(groups).map(([group, names]) => `| ${GROUP[group]} | ${names.map((n) => `\`${cssVariable(n)}\``).join(' ')} |`).join('\n')}
| Estilos de texto | ${Object.keys(typography).map((n) => `\`--${n.replace('.', '-')}\``).join(' ')}. Cada uno con \`--line-height\`, \`--font-weight\` y \`--letter-spacing\`: \`--text-h1--line-height\` |
| Radios | ${Object.keys(primitives).filter((n) => n.startsWith('radius.')).map((n) => `\`--${n.replace('.', '-')}\``).join(' ')} |
| Sombras | ${Object.keys(primitives).filter((n) => n.startsWith('shadow.')).map((n) => `\`--${n.replace('.', '-')}\``).join(' ')} |
| Espacio | \`calc(var(--spacing) * N)\`: múltiplos de ${primitives['space.unit'].value} |

Qué texto puede ir sobre qué fondo: \`tokens/contrast.json\`.
`

writeFileSync(join(root, 'docs', 'catalogo.md'), out)
console.log(`Catálogo: ${patterns.length} patrones, ${components.length} componentes`)
