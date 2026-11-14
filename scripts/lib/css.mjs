// El CSS de un componente: lo que hay dentro de sus css`…` de Lit, y qué tokens usa.
// En Web Components no hay clases de Tailwind que delaten un token: se lee cada var(--…).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cssVariable, primitiveVariable, primitives, root, themes, typography } from './tokens.mjs'

/** El texto de todos los bloques css`…` de un fichero. */
export const cssOf = (code) => [...code.matchAll(/\bcss`([\s\S]*?)`/g)].map((m) => m[1]).join('\n')

// Qué variables delatan el uso de cada token.
const exact = (variable) => new RegExp(`var\\(\\s*${variable}\\s*[,)]`)
export const detectors = {}
for (const name of Object.keys(themes.light)) detectors[name] = exact(cssVariable(name))
for (const name of Object.keys(typography)) detectors[name] = new RegExp(`var\\(\\s*--text-${name.slice(5)}(--[a-z-]+)?\\s*[,)]`)
for (const name of Object.keys(primitives)) {
  if (name.startsWith('radius.') || name.startsWith('shadow.')) detectors[name] = exact(`--${name.replace('.', '-')}`)
}

/** Los tokens que usa un CSS. */
export const tokensIn = (css) => Object.keys(detectors).filter((token) => detectors[token].test(css))

// Las variables que existen: las de tokens.css. Los primitivos de color existen pero no se pueden usar.
const generated = readFileSync(join(root, 'src', 'styles', 'tokens.css'), 'utf8')
const defined = new Set([...generated.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]))
const primitiveColors = new Set(Object.keys(primitives).filter((n) => n.startsWith('color.')).map(primitiveVariable))

// Colores CSS con nombre: un `background: red` pinta igual que un hex.
const NAMED = 'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'
const namedColor = new RegExp(`(?<![\\w-])(${NAMED.split(' ').join('|')})(?![\\w-])`, 'i')

/**
 * Lo que el CSS de un componente no puede hacer: usar un primitivo, una variable que no existe o
 * un color escrito a mano. Devuelve una lista de mensajes.
 */
export function cssProblems(css) {
  const problems = []
  for (const [, variable] of css.matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (primitiveColors.has(variable)) problems.push(`usa el primitivo ${variable}: usa el token semántico de ese uso`)
    else if (!defined.has(variable)) problems.push(`usa la variable ${variable}, que no existe en tokens.css`)
  }
  for (const [declaration, property, value] of css.matchAll(/(?<![\w-])([a-z-]+)\s*:\s*([^;{}]+);/g)) {
    const bare = value.replace(/var\([^)]*\)/g, '')
    if (/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|color)\(/i.test(bare)) problems.push(`escribe un color a mano: «${declaration.trim()}»`)
    else if (!/^--|^(transition|animation|font-family|content|grid-template)/.test(property) && namedColor.test(bare)) {
      problems.push(`escribe un color a mano: «${declaration.trim()}»`)
    }
  }
  return [...new Set(problems)]
}
