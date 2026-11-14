<!-- GENERADO por scripts/build-catalog.mjs. No editar a mano. -->
# Catálogo de Robur DS

Todo lo que existe en el sistema. Si algo no está aquí, no existe: no lo inventes, proponlo.

## Patrones

Empieza por aquí: si un patrón resuelve la pantalla, úsalo antes de combinar componentes.

| Patrón | Etiqueta | Qué resuelve | Detalle |
|---|---|---|---|
| `EmptyState` | `<robur-empty-state>` | Lo que se ve cuando una lista o una sección todavía no tiene contenido. | `src/patterns/empty-state/EmptyState.pattern.json` |
| `FormLayout` | `<robur-form-layout>` | Un formulario corto: título, campos en columna y las acciones al final. | `src/patterns/form-layout/FormLayout.pattern.json` |
| `SessionLog` | `<robur-session-log>` | Registrar una sesión de entrenamiento: elegir el tipo de día, marcar los ejercicios y guardar. | `src/patterns/session-log/SessionLog.pattern.json` |

## Componentes

| Componente | Etiqueta | Qué es | Props | Detalle |
|---|---|---|---|---|
| `BottomNav` | `<robur-bottom-nav>` | Navegación principal entre las secciones de la app. | `label`, `items`, `value` | `src/components/bottom-nav/BottomNav.contract.json` |
| `Button` | `<robur-button>` | Lanza una acción: guardar, cancelar, borrar. | `variant` (primary · secondary · danger), `fullWidth`, `loading`, `children` | `src/components/button/Button.contract.json` |
| `Card` | `<robur-card>` | Superficie que agrupa contenido relacionado. | `variant` (surface · inverse), `padding` (md · lg), `children` | `src/components/card/Card.contract.json` |
| `Checkbox` | `<robur-checkbox>` | Casilla para marcar algo como hecho o activado. | `label`, `hint` | `src/components/checkbox/Checkbox.contract.json` |
| `Chip` | `<robur-chip>` | Opción compacta que se puede seleccionar. | `variant` (default · accent), `selected`, `children` | `src/components/chip/Chip.contract.json` |
| `ExerciseRow` | `<robur-exercise-row>` | Fila de un ejercicio dentro de una sesión: se marca como hecho y se registran sus cifras. | `name`, `target`, `completed`, `children` | `src/components/exercise-row/ExerciseRow.contract.json` |
| `HeatmapCell` | `<robur-heatmap-cell>` | Una semana del heatmap anual. Su color dice cuántas sesiones hubo. | `week`, `sessions`, `rest`, `current` | `src/components/heatmap-cell/HeatmapCell.contract.json` |
| `Input` | `<robur-input>` | Campo de una línea para escribir texto o una cifra. | `label`, `hint`, `error`, `numeric` | `src/components/input/Input.contract.json` |
| `Sheet` | `<robur-sheet>` | Hoja modal anclada abajo para un detalle o una tarea corta. | `open`, `title`, `children` | `src/components/sheet/Sheet.contract.json` |
| `StatCard` | `<robur-stat-card>` | Una cifra grande con la etiqueta que dice qué mide. | `label`, `value`, `unit`, `variant` (surface · inverse), `series` (primary · secondary) | `src/components/stat-card/StatCard.contract.json` |
| `Tabs` | `<robur-tabs>` | Cambia entre vistas del mismo contenido dentro de una pantalla. | `label`, `tabs`, `value`, `children` | `src/components/tabs/Tabs.contract.json` |

Antes de usar un componente, lee su contrato: `useWhen`, `avoidWhen` y `rules` dicen cuándo y cómo.

Cada pieza es una etiqueta del navegador. Se registra al importar `src/index.ts` (o la carpeta de la pieza) y se escribe en HTML:

- Una prop es un atributo en kebab-case: `fullWidth` se escribe `full-width`. Las listas (`items`, `tabs`, `exercises`) solo se pasan como propiedad: `.items=${…}` en una plantilla de Lit.
- Una prop de tipo función del contrato es un evento con el nombre en kebab-case: `onCompletedChange` es `completed-change`. El dato llega en `event.detail`.
- La prop `children` es lo que va entre las etiquetas.

## Tokens

Variables CSS disponibles. Se usan con `var()` en el CSS de un componente; no existe ningún otro color, radio, sombra o tamaño de texto.

| Para | Variables |
|---|---|
| Texto | `--text-color-primary` `--text-color-secondary` `--text-color-tertiary` `--text-color-action` `--text-color-on-action` `--text-color-on-selected` `--text-color-on-inverse` `--text-color-on-inverse-muted` `--text-color-danger` `--text-color-success` `--text-color-info` |
| Fondos | `--background-color-page` `--background-color-surface` `--background-color-inverse` `--background-color-action` `--background-color-action-soft` `--background-color-selected` `--background-color-danger-soft` `--background-color-success-soft` `--background-color-info-soft` `--background-color-overlay` |
| Bordes | `--border-color-default` `--border-color-control` `--border-color-strong` `--border-color-action` `--border-color-danger` `--border-color-inverse` |
| Foco | `--color-focus-ring` |
| Heatmap | `--color-heat-0` `--color-heat-1` `--color-heat-2` `--color-heat-3` `--color-heat-4` `--color-heat-current` |
| Datos | `--color-data-1` `--color-data-2` |
| Estilos de texto | `--text-display` `--text-h1` `--text-h2` `--text-h3` `--text-title` `--text-body` `--text-sm` `--text-control` `--text-label`. Cada uno con `--line-height`, `--font-weight` y `--letter-spacing`: `--text-h1--line-height` |
| Radios | `--radius-xs` `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-pill` |
| Sombras | `--shadow-sm` `--shadow-md` |
| Espacio | `calc(var(--spacing) * N)`: múltiplos de 4px |

Qué texto puede ir sobre qué fondo: `tokens/contrast.json`.
