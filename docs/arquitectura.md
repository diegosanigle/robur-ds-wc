# Arquitectura de Robur DS

## Capas

```
5. Capa agéntica   reglas · skills · MCP · evals        (Bloques 3 y 4)
4. Documentación   Storybook · web de docs              (Bloque 3)
3. Patrones        combinaciones de componentes         (Bloque 3)
2. Componentes     Web Component + contrato + story     (Bloques 1 y 2)
1. Tokens          primitivos → semánticos              (Bloque 2)
```

Cada capa solo usa la de debajo. Un componente no inventa un color: pide un token.
Un patrón no inventa un botón: usa el componente.

## Nomenclatura

| Qué | Regla | Ejemplo |
|---|---|---|
| Componente | PascalCase, sustantivo en inglés | `Button`, `StatCard` |
| Etiqueta | `robur-` y el nombre en kebab-case | `<robur-button>`, `<robur-stat-card>` |
| Prop | camelCase en inglés; como atributo, en kebab-case | `fullWidth` → `full-width` |
| Variante | minúsculas, por función y no por aspecto | `primary`, `danger` (no `orange`) |
| Estado booleano | adjetivo sin `is` | `disabled`, `loading`, `selected` |
| Token | `categoría.rol.modificador` | `color.text.secondary` |
| Story | PascalCase; en español si describe un caso | `Primary`, `ConError` |

## Estructura de carpetas

```
tokens/                  primitivos, semánticos (claro y oscuro), tipografía y parejas de contraste
scripts/                 generador de tokens y comprobaciones
scripts/figma/           código que se ejecuta dentro de Figma
figma/library.json       foto de la librería de Figma, para comprobar la paridad
mcp/                     servidor MCP y sus datos (generados)
evals/                   casos, corredor y resultados de los evals
metrics/                 mediciones del sistema (generadas)
src/
  components/<nombre>/   <nombre>.ts · <nombre>.stories.ts · <Nombre>.contract.json · index.ts
  screens/<Nombre>/      pantallas compuestas solo con piezas del sistema
  data/                  la página de métricas de Storybook
  patterns/<nombre>/     <nombre>.ts · <nombre>.stories.ts · <Nombre>.pattern.json · index.ts
  foundations/           stories que pintan los tokens
  styles/tokens.css      GENERADO desde tokens/: variables CSS que atraviesan el Shadow DOM
  styles/index.css       estilos base
  index.ts               todo lo que el sistema exporta
docs/                    auditoría, arquitectura, accesibilidad y catálogo (generado)
site/                    web de documentación (generada con npm run docs)
.claude/rules/           reglas por zona del repo
.claude/skills/          procedimientos: nuevo componente, nueva pantalla, sincronizar Figma
.storybook/              configuración de Storybook
.github/workflows/       publicación automática
```

## Stack

Vite · Lit · TypeScript · Storybook · Vitest. Sin Tailwind: cada componente lleva su CSS
dentro de su Shadow DOM y solo usa variables de `tokens.css`.
Se usa TypeScript porque los tipos de las props son la base de la documentación
automática y de la paridad con Figma.

## Tokens y variables CSS

`tokens.css` se carga una vez en la página. Las variables CSS atraviesan el Shadow DOM,
así que el CSS de cada componente las usa con `var()`:

| Token | Variable |
|---|---|
| `color.text.primary` | `var(--text-color-primary)` |
| `color.bg.surface` | `var(--background-color-surface)` |
| `color.border.control` | `var(--border-color-control)` |
| `color.heat.2`, `color.data.1`, `color.focus.ring` | `var(--color-heat-2)`, `var(--color-data-1)`, `var(--color-focus-ring)` |
| `radius.md`, `shadow.sm` | `var(--radius-md)`, `var(--shadow-sm)` |
| `text.h1` | `var(--text-h1)`, `var(--text-h1--line-height)`, `var(--text-h1--font-weight)`, `var(--text-h1--letter-spacing)` |
| `space.unit` | `calc(var(--spacing) * 4)` |

Los primitivos (`--orange-500`) también son variables, pero un componente no puede usarlos:
la comprobación de contratos solo admite las variables de los tokens semánticos.

## Código y Figma

| En el contrato | En Figma |
|---|---|
| Prop `enum` | Propiedad de variante con los mismos valores |
| Prop `boolean` | Propiedad de variante con `false` y `true` |
| Prop `string` | Propiedad de texto |
| Contenido (`node`) | `<slot>` del componente; en Figma, texto o hueco (*slot*), según diga el contrato |
| `function`, `array`, `number` | No existe, salvo que el contrato diga otra cosa |
| Estados (`disabled`, `focus`…) | Propiedad de variante `state` |
| Token semántico `color.bg.action` | Variable `color/bg/action`, colección Semantic |
| Token primitivo `color.orange.700` | Variable `color/orange/700`, colección Primitives, oculta en los selectores |
| Estilo de texto `text.h1` | Estilo de texto `text/h1` |

## Rutina de mantenimiento

| Cuándo | Qué |
|---|---|
| En cada cambio | `npm test` |
| Al cambiar tokens o componentes | `/sincronizar-figma`, que renueva la foto de Figma |
| Cada semana | `npm run metrics -- <carpeta de la app>` y subir el resultado. Mirar si la deuda de la app baja |
| Cada mes, o al cambiar contratos, reglas o descripciones del MCP | `npm run evals` y después `npm run metrics` |
| Cuando un agente se equivoca de una forma nueva | Un caso nuevo en `evals/cases.json` |
