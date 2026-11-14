#!/usr/bin/env node
// MCP de Robur DS: lleva el Design System a cualquier agente, en cualquier proyecto.
// Solo lee mcp/data.json, que se genera con `npm run mcp:data`.
import { readFileSync } from 'node:fs'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { format, validate } from '../scripts/lib/validate.mjs'

const data = JSON.parse(readFileSync(new URL('./data.json', import.meta.url), 'utf8'))
const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] })
const pieces = { ...data.patterns, ...data.components }
const names = Object.keys(pieces).join(', ')

const server = new McpServer(
  { name: 'robur-ds', version: '1.0.0' },
  {
    instructions:
      'Design System de Robur, en Web Components (Lit). Cada pieza es una etiqueta <robur-*>. Para construir interfaz: 1) get_catalog para ver qué existe; 2) get_component de cada pieza que vayas a usar, y respeta su avoidWhen y sus rules; 3) get_tokens si necesitas una variable CSS; 4) validate_code antes de dar el trabajo por terminado, y corrige hasta que no haya errores. Si algo no está en el catálogo, no existe: proponlo, no lo inventes.',
  },
)

server.registerTool(
  'get_catalog',
  {
    title: 'Catálogo del sistema',
    description: 'Todo lo que existe en Robur DS: patrones, componentes, las reglas que valen siempre y las normas de los textos. Llama a esta herramienta la primera, antes de escribir cualquier interfaz.',
  },
  async () =>
    text(
      [
        '# Robur DS',
        'Si algo no está aquí, no existe: no lo inventes, proponlo.',
        '## Patrones (míralos primero)',
        ...Object.values(data.patterns).map((p) => `- ${p.name} (<${p.tag}>): ${p.description}`),
        '## Componentes',
        ...Object.values(data.components).map((c) => `- ${c.name} (<${c.tag}>): ${c.description}`),
        '## Reglas que valen siempre',
        ...data.rules.map((r) => `- ${r}`),
        '## Textos de la interfaz',
        ...data.writing.map((r) => `- ${r}`),
      ].join('\n'),
    ),
)

server.registerTool(
  'get_component',
  {
    title: 'Contrato de una pieza',
    description: 'El contrato completo de un componente o de un patrón: cuándo usarlo, cuándo no y qué usar en su lugar, props con sus valores, reglas, accesibilidad, su etiqueta y un ejemplo en HTML de Lit. En HTML, cada prop se escribe con el atributo que dice attributes (fullWidth es full-width); las que no tienen atributo (listas) se pasan como propiedad: .items=${…}. Una prop función como onCompletedChange es el evento que dice events (completed-change), que se escucha con @completed-change y trae el dato en event.detail. children es lo que va entre las etiquetas. Llámala para cada pieza antes de usarla.',
    inputSchema: { name: z.string().describe('Nombre exacto de la pieza, como aparece en el catálogo: Button, FormLayout…') },
  },
  async ({ name }) => (pieces[name] ? text(pieces[name]) : text(`"${name}" no existe en Robur DS. Piezas disponibles: ${names}. Si ninguna sirve, propón una nueva en lugar de inventarla.`)),
)

server.registerTool(
  'get_tokens',
  {
    title: 'Variables de diseño disponibles',
    description: 'Las variables CSS que existen en Robur DS, con su uso: se usan con var() en el CSS. No existe ningún otro color, radio, sombra ni tamaño de texto, y los primitivos (--orange-500) no se usan. Los espacios son calc(var(--spacing) * N).',
    inputSchema: { group: z.enum(['text', 'bg', 'border', 'focus', 'heat', 'data', 'typography', 'radius', 'shadow']).optional().describe('Grupo que interesa. Sin él, se devuelven todos.') },
  },
  async ({ group }) => {
    const colors = (g) => data.tokens.filter((t) => t.group === g).map((t) => ({ variable: t.variable, use: t.description }))
    const all = {
      ...Object.fromEntries(['text', 'bg', 'border', 'focus', 'heat', 'data'].map((g) => [g, colors(g)])),
      typography: data.textStyles,
      radius: data.radii,
      shadow: data.shadows,
    }
    return text(group ? all[group] : all)
  },
)

server.registerTool(
  'get_text_on',
  {
    title: 'Qué texto va sobre un fondo',
    description: 'Dado un fondo, las variables de color de texto que se pueden poner encima cumpliendo el contraste, con su razón en cada tema.',
    inputSchema: { background: z.string().describe('Variable de fondo: --background-color-surface, --background-color-action, --background-color-inverse…') },
  },
  async ({ background }) => {
    const token = data.tokens.find((t) => t.variable === background.replace(/^var\(|\)$/g, ''))
    if (!token) return text(`"${background}" no es un fondo del sistema. Fondos: ${data.tokens.filter((t) => t.group === 'bg').map((t) => t.variable).join(', ')}.`)
    const allowed = data.contrast
      .filter((p) => p.bg === token.token && /^color\.(text|data)\./.test(p.fg))
      .map((p) => ({ variable: data.tokens.find((t) => t.token === p.fg).variable, min: p.min, light: p.light, dark: p.dark }))
    return text(allowed.length ? allowed : `No hay ninguna pareja declarada para ${background}: no pongas texto encima sin proponer la pareja.`)
  },
)

server.registerTool(
  'validate_code',
  {
    title: 'Revisar una interfaz',
    description: 'Revisa HTML o un componente de Lit contra el sistema: controles dibujados a mano, piezas, props o eventos que no existen, atributos mal escritos, valores de variante inválidos, colores y medidas a mano en el CSS, variables que no son del sistema, más de un botón primary y textos que suenan a reproche. Llámala antes de dar una interfaz por terminada.',
    inputSchema: { code: z.string().describe('El HTML o el fichero .ts del componente de Lit de la pantalla o de la sección, con su CSS.') },
  },
  async ({ code }) => text(format(validate(code, data))),
)

await server.connect(new StdioServerTransport())
