# Robur DS (Web Components)

Design System de Robur, una app personal de entrenamiento en casa, escrito como Web Components
con Lit. Es el mismo sistema que `robur-ds-react`: los tokens, los contratos, los casos de eval
y la librería de Figma se cambian allí y se copian aquí.

Robur registra, no juzga: no hay objetivos, metas ni avisos de fallo. Una semana a
cero es un dato, no un error.

## Dónde mirar, en este orden

1. `docs/catalogo.md` — todo lo que existe, en una página. Empieza siempre aquí.
2. El contrato de la pieza (`*.contract.json` o `*.pattern.json`) — cuándo se usa, cuándo no y sus reglas.
3. El código y las stories — solo si vas a cambiar la pieza.

## Comandos

- `npm run storybook` — Storybook en local (puerto 6009)
- `npm run cem` — genera `custom-elements.json`, la descripción de cada etiqueta que leen Storybook y las comprobaciones
- `npm run check` — genera tokens, manifiesto, catálogo y ficheros de Code Connect, y comprueba contraste, contratos, patrones, paridad con Figma y Code Connect
- `npm run figma:connect` — publica Code Connect en Figma (necesita un plan de pago y `FIGMA_ACCESS_TOKEN`)
- `npm test` — `check` + tests de las stories (interacción y accesibilidad)
- `npm run build` — comprueba tipos y compila la librería
- `npm run docs` — genera la web de documentación

## Reglas que valen siempre

- **Usa lo que hay.** Antes de escribir interfaz, busca en el catálogo un patrón; si no lo hay, componentes. Nunca un `<button>`, un `<input>` o un estilo propio para algo que ya existe: se usa su etiqueta, `<robur-button>` o `<robur-input>`.
- **Si falta algo, para y propónlo.** Un token, una variante o un componente nuevo se propone con su motivo; no se improvisa.
- **Ningún valor a mano.** En el CSS de un componente, colores, espacios, radios, sombras y tipografía salen de las variables del catálogo con `var(--…)`. Ni hex, ni nombres de color, ni primitivos (`--orange-500`). Solo los grosores de borde y de foco (1px, 2px, 3px) se escriben tal cual.
- **El código manda.** Un cambio empieza en `tokens/` o en un contrato, y de ahí va a Figma. Nunca al revés.
- **Lo generado no se edita:** `src/styles/tokens.css`, `custom-elements.json`, `docs/catalogo.md`, `figma/library.json`, `figma/code-connect/` y `site/`.
- **Terminado es en verde.** Un cambio no está hecho hasta que pasan `npm test` y `npm run build`.
- Texto de la interfaz en español. Código y nombres de props en inglés.

Las reglas de cada zona del repo están en `.claude/rules/` y se cargan solas al tocar
esos ficheros. Los procedimientos largos son skills: `/nuevo-componente`,
`/nueva-pantalla` y `/sincronizar-figma`.

## Contexto

- `docs/arquitectura.md` — capas, nomenclatura y correspondencia entre código y Figma.
- `docs/accesibilidad.md` — qué se comprueba solo, qué se resuelve a propósito dentro del Shadow DOM y qué hay que revisar a mano.
- `docs/auditoria.md` — qué había antes de este sistema y qué se decidió.
- Figma: https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC (solo tema claro: el plan gratuito admite un modo).
