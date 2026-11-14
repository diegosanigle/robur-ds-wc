// Arranca el MCP de verdad, como lo haría un agente, y comprueba que cada herramienta responde bien.
// Uso: node scripts/check-mcp.mjs   ·   node scripts/check-mcp.mjs <herramienta> '<json de argumentos>'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { root } from './lib/tokens.mjs'

const client = new Client({ name: 'check-mcp', version: '1.0.0' })
await client.connect(new StdioClientTransport({ command: 'node', args: [join(root, 'mcp', 'server.mjs')] }))
const call = async (name, args = {}) => (await client.callTool({ name, arguments: args })).content[0].text

// Modo manual: llamar a una herramienta y ver lo que ve el agente.
if (process.argv[2]) {
  console.log(await call(process.argv[2], JSON.parse(process.argv[3] ?? '{}')))
  await client.close()
  process.exit(0)
}

const errors = []
const expect = (label, ok) => ok || errors.push(label)
const tools = (await client.listTools()).tools

expect('hay cinco herramientas', tools.length === 5)
for (const tool of tools) expect(`${tool.name} tiene una descripción de al menos 60 caracteres`, tool.description?.length >= 60)

const catalog = await call('get_catalog')
expect('el catálogo lista los patrones antes que los componentes', catalog.indexOf('SessionLog') > 0 && catalog.indexOf('SessionLog') < catalog.indexOf('- Button') && catalog.includes('<robur-button>'))
expect('el catálogo incluye las normas de textos', catalog.includes('registra, no juzga'))

const button = JSON.parse(await call('get_component', { name: 'Button' }))
expect(
  'get_component devuelve avoidWhen, props descritas, atributos, atributos nativos y ejemplo',
  button.avoidWhen.length > 0 && button.props[0].description && button.attributes.fullWidth === 'full-width' && button.native.some((n) => n.name === 'disabled') && button.example.includes('<robur-button'),
)
expect('get_component dice el nombre de cada evento', JSON.parse(await call('get_component', { name: 'ExerciseRow' })).events.onCompletedChange === 'completed-change')
expect('una pieza que no existe devuelve la lista de las que sí', (await call('get_component', { name: 'Badge' })).includes('no existe'))

expect('get_tokens filtra por grupo', JSON.parse(await call('get_tokens', { group: 'bg' })).some((t) => t.variable === '--background-color-action'))
expect('get_text_on dice qué texto va sobre la acción', (await call('get_text_on', { background: '--background-color-action' })).includes('--text-color-on-action'))

const bad = await call('validate_code', {
  code: '<style>div { padding: 13px; color: #ff0000; background: var(--orange-500) }</style><div class="bg-red-500"><button>¡Enviar!</button><robur-button variant="ghost" fullWidth>Ok</robur-button><robur-badge></robur-badge></div>',
})
for (const rule of ['no-arbitrary', 'no-hex', 'unknown-token', 'unknown-class', 'no-raw-control', 'invalid-value', 'unknown-prop', 'unknown-component']) expect(`validate_code detecta ${rule}`, bad.includes(rule))
const good = await call('validate_code', { code: '<robur-empty-state title="Aún no hay sesiones esta semana" description="Cuando registres una, aparecerá aquí."></robur-empty-state>' })
expect('validate_code acepta un uso correcto', good.startsWith('✓'))

await client.close()
if (errors.length) {
  console.error(`MCP: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`MCP: ${tools.length} herramientas, todas responden como se espera.`)
