// Prepara los tokens para llevarlos a Figma: variables, estilos de texto y sombras.
// Uso: node scripts/figma-tokens.mjs > /tmp/figma-tokens.json
// El agente pasa este JSON a scripts/figma/sync-variables.js y lo ejecuta en Figma.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cssVariable, primitiveVariable, primitives, reference, root, themes, typography } from './lib/tokens.mjs'

const slash = (name) => name.replaceAll('.', '/')

// Dónde puede usarse cada grupo de color dentro de Figma.
const SCOPES = {
  text: ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
  bg: ['FRAME_FILL', 'SHAPE_FILL'],
  border: ['STROKE_COLOR'],
  focus: ['STROKE_COLOR'],
  heat: ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
  data: ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
}

// Figma no multiplica: se crea una variable por cada múltiplo de space.unit que usan los componentes.
const unit = parseFloat(primitives['space.unit'].value)
const components = join(root, 'src', 'components')
const code = readdirSync(components).map((name) => readFileSync(join(components, name, `${name}.ts`), 'utf8')).join('\n')
// En el CSS de cada componente, los espacios son calc(var(--spacing) * N) en padding, margin y gap.
const spacing = [...code.matchAll(/(?<![\w-])(?:padding|margin|gap|row-gap|column-gap)[\w-]*\s*:\s*([^;]+);/g)].map((m) => m[1]).join(' ')
// Un 0 a secas (`padding: 0`) es el paso 0, como `p-0` en Tailwind.
const multiples = [...spacing.matchAll(/calc\(var\(--spacing\) \* (\d+(?:\.\d+)?)\)/g)].map((m) => Number(m[1]))
const zero = /(^|\s)0(\s|$)/.test(spacing.replace(/calc\([^)]*\)/g, ' ')) ? [0] : []
const steps = [...new Set([...zero, ...multiples])].sort((a, b) => a - b)

const out = {
  primitives: [
    ...Object.entries(primitives)
      .filter(([, t]) => t.type === 'color')
      .map(([name, t]) => ({ name: slash(name), type: 'COLOR', value: t.value, scopes: [], syntax: `var(${primitiveVariable(name)})` })),
    ...Object.entries(primitives)
      .filter(([name]) => name.startsWith('radius.'))
      .map(([name, t]) => ({ name: slash(name), type: 'FLOAT', value: parseFloat(t.value), scopes: ['CORNER_RADIUS'], syntax: `var(--${name.replace('.', '-')})` })),
    ...steps.map((step) => ({ name: `space/${step * unit}`, type: 'FLOAT', value: step * unit, scopes: ['GAP'], syntax: `calc(var(--spacing) * ${step})` })),
  ],
  semantic: Object.keys(themes.light).map((name) => ({
    name: slash(name),
    scopes: SCOPES[name.split('.')[1]],
    syntax: `var(${cssVariable(name)})`,
    description: themes.light[name].description ?? '',
    modes: Object.fromEntries(Object.keys(themes).map((theme) => [theme, slash(reference(themes[theme][name], name))])),
  })),
  textStyles: Object.entries(typography).map(([name, t]) => ({
    name: slash(name),
    fontFamily: primitives['font.sans'].value[0],
    fontSize: parseFloat(t.value.fontSize),
    fontWeight: t.value.fontWeight,
    lineHeight: t.value.lineHeight * 100,
    letterSpacing: parseFloat(t.value.letterSpacing) * 100,
    description: t.description ?? '',
  })),
  shadows: Object.entries(primitives)
    .filter(([name]) => name.startsWith('shadow.'))
    .map(([name, t]) => {
      const [, x, y, blur, r, g, b, a] = /^(\S+) (\S+) (\S+) rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/.exec(t.value)
      return { name: slash(name), x: parseFloat(x), y: parseFloat(y), blur: parseFloat(blur), color: { r: r / 255, g: g / 255, b: b / 255, a: Number(a) } }
    }),
}

console.log(JSON.stringify(out))
