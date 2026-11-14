// Genera mcp/data.json: todo lo que el MCP sabe del sistema, en un solo fichero.
// El servidor solo lee este fichero, así que funciona fuera del repo, sin el código fuente.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components, patterns } from './lib/system.mjs'
import { cssVariable, primitiveVariable, primitives, reference, resolve, root, themes, typography } from './lib/tokens.mjs'
import { nativeAttributes } from './lib/wc-meta.mjs'
import { contrast } from './check-contrast.mjs'

const SITE = 'https://diegosanigle.github.io/robur-ds-wc'
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

function example(piece) {
  // El ejemplo va en HTML de Lit: la etiqueta, los atributos en kebab-case, las listas como
  // propiedad (.items) y los eventos con @.
  const attrs = piece.props
    .filter((p) => p.required && p.name !== 'children')
    .map((p) => {
      if (p.type === 'function') return `@${piece.events[p.name]}=\${…}`
      const attribute = piece.attributes[p.name]
      // Sin atributo (listas), o con el nombre de un atributo global de HTML (title pinta un aviso): como propiedad.
      if (!attribute || attribute === 'title') return `.${p.name}=\${…}`
      return p.type === 'boolean' ? `?${attribute}=\${…}` : `${attribute}="…"`
    })
    .join(' ')
  const open = `<${piece.tag}${attrs ? ` ${attrs}` : ''}>`
  const body = piece.props.some((p) => p.name === 'children') ? '…' : ''
  return `import '${pkg.name}'\n\n// Dentro de una plantilla html\`…\` de Lit, o en HTML (sin las partes \${…}).\n${open}${body}</${piece.tag}>`
}

const piece = (p) => {
  // La etiqueta, los atributos y los eventos se quedan: es como se escribe la pieza. La ruta es del repo.
  const { propDocs, stories, kind, slug, path, className, ...contract } = p
  return {
    ...contract,
    props: contract.props.map((prop) => ({ ...prop, description: propDocs[prop.name] || undefined })),
    example: example(p),
    docs: `${SITE}/docs/${kind === 'pattern' ? 'patrones' : 'componentes'}/${p.name}`,
    storybook: `${SITE}/?path=/story/${stories[0].id}`,
  }
}

const tokens = Object.keys(themes.light).map((name) => ({
  token: name,
  group: name.split('.')[1],
  variable: cssVariable(name),
  description: themes.light[name].description ?? '',
  light: reference(themes.light[name], name).replace('color.', ''),
  dark: reference(themes.dark[name], name).replace('color.', ''),
}))
const textStyles = Object.entries(typography).map(([name, t]) => ({ variable: `--text-${name.slice(5)}`, size: t.value.fontSize, weight: t.value.fontWeight, description: t.description ?? '' }))
const radii = Object.keys(primitives).filter((n) => n.startsWith('radius.')).map((n) => `--${n.replace('.', '-')}`)
const shadows = Object.keys(primitives).filter((n) => n.startsWith('shadow.')).map((n) => `--${n.replace('.', '-')}`)

const { pairs } = JSON.parse(readFileSync(join(root, 'tokens', 'contrast.json'), 'utf8'))
const round = (n) => Math.floor(n * 100) / 100
const bullets = (file, heading) => {
  const text = readFileSync(join(root, file), 'utf8')
  const section = heading ? text.slice(text.indexOf(heading)).split(/\n## /)[0] : text
  return [...section.matchAll(/^- (.+(?:\n  .+)*)/gm)].map((m) => m[1].replace(/\n\s+/g, ' '))
}

const data = {
  name: pkg.name,
  generated: 'scripts/build-mcp-data.mjs',
  components: Object.fromEntries(components.map((c) => [c.name, piece(c)])),
  patterns: Object.fromEntries(patterns.map((p) => [p.name, piece(p)])),
  tokens,
  textStyles,
  radii,
  shadows,
  // Todas las variables de diseño que existen. Cualquier otra es un error.
  variables: [
    ...tokens.map((t) => t.variable),
    ...textStyles.flatMap((t) => [t.variable, `${t.variable}--line-height`, `${t.variable}--font-weight`, `${t.variable}--letter-spacing`]),
    ...radii,
    ...shadows,
    '--spacing',
    '--font-sans',
  ],
  // Los primitivos existen como variables, pero no se usan.
  primitives: Object.keys(primitives).filter((n) => n.startsWith('color.')).map(primitiveVariable),
  // Los eventos que cualquier elemento admite (click, keydown…): no son de ninguna pieza.
  globalEvents: [...nativeAttributes('div')].filter((n) => n.startsWith('on')).map((n) => n.slice(2)),
  contrast: pairs.map((p) => ({ ...p, light: round(contrast(resolve('light', p.fg), resolve('light', p.bg))), dark: round(contrast(resolve('dark', p.fg), resolve('dark', p.bg))) })),
  rules: bullets('CLAUDE.md', '## Reglas que valen siempre'),
  writing: bullets('.claude/rules/textos.md'),
}

writeFileSync(join(root, 'mcp', 'data.json'), `${JSON.stringify(data, null, 1)}\n`)
console.log(`MCP: datos de ${components.length} componentes, ${patterns.length} patrones y ${tokens.length} tokens`)
