// Revisa un trozo de interfaz (HTML, o un componente de Lit con sus plantillas html`…` y su CSS) contra
// el sistema. No ejecuta el código: lo lee.
// Lo usan el MCP (validate_code), la comprobación de uso (check-usage) y los evals.
// `data` es el contenido de mcp/data.json.
//
// En Web Components no hay clases que delaten un token: lo que se mira es el CSS (hex, colores con
// nombre, medidas a mano, variables que no son del sistema) y las etiquetas robur-* con sus
// atributos, propiedades (.prop) y eventos (@evento).

const RAW = { button: 'Button', input: 'Input o Checkbox', select: 'Chip o Tabs', textarea: 'Input', dialog: 'Sheet' }
// Clases que en otros sistemas pintan (Tailwind): aquí no existen. Una pieza o var(--…) en su lugar.
const DESIGN = /^(bg|text|border|rounded|shadow|ring|outline|fill|stroke)-(.+)$/
const NEUTRAL = {
  text: /^(left|center|right|justify|wrap|nowrap|balance|pretty|ellipsis|clip)$/,
  bg: /^(transparent|current|inherit|none)$/,
  border: /^(\d+|[trblxyse](-\d+)?|dashed|dotted|solid|none|collapse|separate|transparent|current)$/,
  rounded: /^$/,
  shadow: /^none$/,
  ring: /^(\d+|inset|offset-\d+)$/,
  outline: /^(\d+|none|hidden|dashed|dotted|offset-\d+)$/,
  fill: /^(none|current)$/,
  stroke: /^(none|current|\d+)$/,
}
// Atributos que valen en cualquier etiqueta y que no son props de la pieza.
const HOST = /^(class|id|slot|part|role|hidden|tabindex|lang|dir|inert|aria-[\w-]+|data-[\w-]+)$/
const BLAME = /\b(objetivos?|metas?|fallaste|fallado|fracas\w+|no has (entrenado|cumplido|hecho)|deberías|te falta[n]?)\b|¡/i
const NAMED = /(?<![\w-])(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)(?![\w-])/i

const camel = (text) => text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
const kebab = (text) => text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const eventToProp = (event) => `on${camel(event)[0].toUpperCase()}${camel(event).slice(1)}`
const eventOf = (prop) => kebab(prop.name.slice(2))
/** Los comentarios no cuentan: un `<button>` en un comentario no es un botón. Se cambian por espacios para no mover las líneas. */
const blank = (text) => text.replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '))

/** Cada etiqueta de apertura `<nombre …>`, saltando las expresiones `${…}` de Lit, que pueden llevar `>`. */
function* tags(code) {
  const open = /<([a-z][a-z0-9]*(?:-[a-z0-9]+)*)(?=[\s/>])/g
  let m
  while ((m = open.exec(code))) {
    let i = m.index + m[0].length
    let depth = 0
    let quote = null
    for (; i < code.length; i++) {
      const c = code[i]
      if (quote) {
        if (c === quote) quote = null
      } else if (c === '$' && code[i + 1] === '{') {
        depth++
        i++
      } else if (depth && c === '{') depth++
      else if (depth && c === '}') depth--
      else if (!depth && (c === '"' || c === "'")) quote = c
      else if (!depth && c === '>') break
    }
    yield { name: m[1], attributes: code.slice(m.index + m[0].length, i).replace(/\/$/, ''), index: m.index }
    open.lastIndex = i
  }
}

/** Los atributos de una etiqueta: nombre, valor literal (si lo es) y si el valor es una expresión `${…}`. */
function* attributes(text) {
  let i = 0
  while (i < text.length) {
    const name = /^\s*([^\s=/>"']+)/.exec(text.slice(i))
    if (!name) break
    i += name[0].length
    let value
    let dynamic = false
    if (text[i] === '=') {
      i++
      const c = text[i]
      if (c === '"' || c === "'") {
        const end = text.indexOf(c, i + 1)
        value = text.slice(i + 1, end)
        i = end + 1
      } else if (c === '$' && text[i + 1] === '{') {
        let depth = 0
        const start = i
        for (; i < text.length; i++) {
          if (text[i] === '{') depth++
          if (text[i] === '}' && --depth === 0) break
        }
        value = text.slice(start, ++i)
      } else {
        const bare = /^[^\s>]*/.exec(text.slice(i))[0]
        value = bare
        i += bare.length
      }
      dynamic = /\$\{/.test(value)
    }
    yield { raw: name[1], value, dynamic }
  }
}

export function validate(source, data, { level = 'screen' } = {}) {
  const issues = []
  const code = blank(source)
  const add = (rule, severity, message, index) =>
    issues.push({ rule, severity, message, line: index === undefined ? undefined : code.slice(0, index).split('\n').length })
  const pieces = { ...data.components, ...data.patterns }
  const byTag = Object.fromEntries(Object.values(pieces).map((piece) => [piece.tag, piece]))
  const tagOf = (name) => pieces[name].tag
  const variables = new Set(data.variables)
  const primitives = new Set(data.primitives)

  // 1. CSS: lo que hay dentro de css`…` y de <style>…</style>.
  const blocks = [...code.matchAll(/\bcss`([^`]*)`|<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({ text: m[1] ?? m[2], offset: m.index + m[0].indexOf(m[1] ?? m[2]) }))
  for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) add('no-hex', 'error', `Color a mano ${m[0]}: usa la variable de un token (get_tokens).`, m.index)
  for (const { text, offset } of blocks) {
    for (const d of text.matchAll(/(?<![\w-])([a-z-]+)\s*:\s*([^;{}]+);/g)) {
      const [declaration, property, value] = d
      const at = offset + d.index
      const bare = value.replace(/var\([^)]*\)/g, '')
      if (property.startsWith('--')) continue
      if (/\b(rgba?|hsla?|oklch|oklab|lab|lch)\(/i.test(bare)) add('no-hex', 'error', `Color a mano «${declaration.trim()}»: usa la variable de un token (get_tokens).`, at)
      else if (!/^(font-family|content|transition|animation|grid-template|grid-area)/.test(property) && NAMED.test(bare)) {
        add('no-hex', 'error', `Color a mano «${declaration.trim()}»: usa la variable de un token (get_tokens).`, at)
      }
      // Medidas a mano: solo valen los grosores de borde y de foco (hasta 3px) y el 0.
      const length = /(?<![\w.-])(\d*\.?\d+)(px|rem|em)\b/.exec(bare.replace(/calc\([^)]*\)/g, ''))
      if (length && !(length[2] === 'px' && Number(length[1]) <= 3)) {
        add('no-arbitrary', 'error', `Valor a mano «${declaration.trim()}»: usa calc(var(--spacing) * N) o la variable de un token.`, at)
      }
    }
    for (const v of text.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (primitives.has(v[1])) add('unknown-token', 'error', `${v[1]} es un primitivo: usa el token semántico de ese uso (get_tokens).`, offset + v.index)
      else if (!variables.has(v[1])) add('unknown-token', 'error', `La variable ${v[1]} no existe en el sistema. Consulta get_tokens.`, offset + v.index)
    }
  }

  // 2. Clases de diseño: aquí no hay ninguna, todas las pone el sistema.
  for (const m of code.matchAll(/\bclass(?:Name)?=["']([^"']*)["']/g)) {
    for (const word of m[1].split(/\s+/)) {
      const cls = word.split(':').pop().split('/')[0]
      if (/-\[[^\]]+\]$/.test(cls)) {
        add('no-arbitrary', 'error', `Valor arbitrario "${cls}": aquí no hay clases de diseño. Usa una pieza del sistema o var(--…).`, m.index)
        continue
      }
      const match = DESIGN.exec(cls)
      if (match && /^[a-z0-9-]+$/.test(cls) && !NEUTRAL[match[1]].test(match[2])) {
        add('unknown-class', 'error', `La clase "${cls}" no existe en el sistema: en Web Components el aspecto lo ponen las piezas y var(--…). Consulta get_tokens.`, m.index)
      }
    }
  }
  if (level === 'component') return issues

  // 3. Estilos en línea.
  for (const m of code.matchAll(/(?<![\w-])style=|styleMap\(/g)) add('no-inline-style', 'error', 'Estilo en línea: ponlo en el CSS con variables de tokens.', m.index)

  // Las etiquetas que el propio fichero registra no son piezas inventadas.
  const local = new Set([...code.matchAll(/(?:@customElement\(|customElements\.define\()\s*['"]([\w-]+)['"]/g)].map((m) => m[1]))
  const found = [...tags(code)]

  for (const tag of found) {
    // 4. Controles dibujados a mano.
    if (RAW[tag.name]) {
      add('no-raw-control', 'error', `<${tag.name}> dibujado a mano: usa ${RAW[tag.name]} (<${tagOf(RAW[tag.name].split(' ')[0])}>).`, tag.index)
      continue
    }
    if (!tag.name.includes('-')) continue
    // 5. Piezas, props, eventos y valores que no existen.
    const piece = byTag[tag.name]
    if (!piece) {
      if (!local.has(tag.name)) add('unknown-component', 'error', `<${tag.name}> no existe en el sistema. Mira get_catalog; si falta, proponlo.`, tag.index)
      continue
    }
    const name = piece.name
    const given = new Set()
    const propsList = piece.props.filter((p) => p.type !== 'function' && p.name !== 'children').map((p) => `${p.name}${piece.attributes[p.name] && piece.attributes[p.name] !== p.name ? ` (${piece.attributes[p.name]})` : ''}`).join(', ')
    for (const { raw, value, dynamic } of attributes(tag.attributes)) {
      const prefix = /^[.?@]/.test(raw) ? raw[0] : ''
      const bare = prefix ? raw.slice(1) : raw
      if (prefix === '@') {
        const propName = eventToProp(bare)
        given.add(propName)
        if (piece.props.some((p) => p.name === propName && p.type === 'function')) continue
        if (data.globalEvents.includes(bare.toLowerCase()) || (piece.extends && (piece.nativeEvents ?? []).includes(bare))) continue
        add('unknown-prop', 'error', `${name} no tiene el evento "${bare}". Eventos: ${piece.props.filter((p) => p.type === 'function').map(eventOf).join(', ') || 'ninguno'}.`, tag.index)
        continue
      }
      // Una propiedad (.prop) usa el nombre en camelCase; un atributo, el de HTML en kebab-case.
      const propName = prefix === '.' ? bare : Object.keys(piece.attributes).find((p) => piece.attributes[p] === bare)
      const prop = propName && piece.props.find((p) => p.name === propName)
      if (prop) {
        given.add(prop.name)
        if (prop.type === 'enum' && value !== undefined && !dynamic && prefix !== '.' && !prop.values.includes(value)) {
          add('invalid-value', 'error', `${name}: ${bare}="${value}" no existe. Valores: ${prop.values.join(', ')}.`, tag.index)
        }
        continue
      }
      if (HOST.test(bare) || (prefix === '.' && piece.native.some((n) => n.name === bare))) continue
      if (piece.native.some((n) => n.attribute === bare)) continue
      const asAttribute = piece.attributes[bare]
      if (asAttribute) {
        add('unknown-prop', 'error', `${name}: en HTML, "${bare}" se escribe "${asAttribute}" (o como propiedad: .${bare}).`, tag.index)
        continue
      }
      if (piece.extends) {
        add('unknown-prop', 'error', `${name} no admite "${bare}": no llegaría al <${piece.extends}> de dentro. Props: ${propsList}. Atributos nativos: ${piece.native.map((n) => n.attribute ?? n.name).join(', ')}.`, tag.index)
      } else {
        add('unknown-prop', 'error', `${name} no tiene la prop "${bare}". Props: ${propsList}.`, tag.index)
      }
    }
    for (const prop of piece.props.filter((p) => p.required && p.name !== 'children')) {
      if (given.has(prop.name)) continue
      const label = prop.type === 'function' ? `escuchar el evento obligatorio "${eventOf(prop)}"` : `la prop obligatoria "${piece.attributes[prop.name] ?? `.${prop.name}`}"`
      add('missing-prop', 'error', prop.type === 'function' ? `A ${name} le falta ${label}.` : `A ${name} le falta ${label}.`, tag.index)
    }
  }

  // 6. Textos: Robur registra, no juzga.
  for (const m of code.matchAll(/>([^<>{}$`]+)</g)) {
    const blame = BLAME.exec(m[1])
    if (blame) add('neutral-copy', 'warning', `Texto "${m[1].trim()}": "${blame[0]}" suena a meta, a fallo o a exclamación. Robur registra, no juzga.`, m.index)
  }
  for (const m of code.matchAll(/(?<![\w-])\.?(?:title|description|label|hint|error|action-label|submit-label|cancel-label|actionLabel|submitLabel|cancelLabel)=["']([^"']+)["']/g)) {
    const blame = BLAME.exec(m[1])
    if (blame) add('neutral-copy', 'warning', `Texto "${m[1]}": "${blame[0]}" suena a meta, a fallo o a exclamación. Robur registra, no juzga.`, m.index)
  }

  // 7. Reglas de composición que se pueden contar.
  const of = (name) => found.filter((t) => t.name === tagOf(name)).map((t) => t.attributes)
  const primaries = of('Button').filter((a) => !/variant=/.test(a) || /variant=["']primary/.test(a)).length
  if (primaries > 1) add('one-primary', 'warning', `Hay ${primaries} botones primary. La regla es uno por pantalla.`)
  const inverse = [...of('Card'), ...of('StatCard')].filter((a) => /variant=["']inverse/.test(a)).length
  if (inverse > 1) add('one-inverse', 'warning', `Hay ${inverse} tarjetas inverse. La regla es como mucho una por pantalla.`)

  return issues
}

export const format = (issues) =>
  issues.length
    ? issues.map((i) => `${i.severity === 'error' ? '✗' : '!'} [${i.rule}]${i.line ? ` línea ${i.line}:` : ''} ${i.message}`).join('\n')
    : '✓ Sin problemas: el código usa solo piezas y variables del sistema.'
