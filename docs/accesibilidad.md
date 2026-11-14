# Accesibilidad de Robur DS

Objetivo: WCAG 2.2 nivel AA.

## Qué se comprueba solo

| Comprobación | Dónde | Cuándo falla |
|---|---|---|
| Contraste entre tokens, en los dos temas | `npm run check` (`tokens/contrast.json`) | Una pareja declarada baja de su mínimo |
| Reglas de axe en cada story | `npm test` | Cualquier story incumple una regla |
| Uso con teclado y nombres accesibles | Stories `Interaccion` | El componente no responde o no se anuncia bien |

## Mínimos de contraste

| Caso | Mínimo | Criterio |
|---|---|---|
| Texto normal | 4,5:1 | 1.4.3 |
| Texto grande (24 px, o 18,66 px en negrita) | 3:1 | 1.4.3 |
| Borde o relleno que delimita un control, y el anillo de foco | 3:1 | 1.4.11 |

## Decisiones

1. **Botón primario.** Blanco sobre `orange-500` daba 3,57:1. La acción principal usa
   `orange-700` (5,56:1). El naranja de marca se mantiene en datos, heatmap y foco.
2. **Borde de campos y casillas.** `neutral-200` daba 1,3:1 contra el fondo. Los controles
   usan `border-control` (`neutral-500`, 3,79:1). `border-default` queda para separadores.
3. **Placeholder.** Sin transparencia: usa `text-tertiary` (6,16:1).
4. **Zona pulsable.** 44 px de alto como mínimo en todos los controles.
5. **Movimiento.** Con `prefers-reduced-motion` no hay animaciones.

## Dentro del Shadow DOM

Cada componente es una etiqueta `<robur-*>` con su propio Shadow DOM. axe entra en él y
comprueba lo que de verdad se pinta, pero tres cosas se resuelven a propósito:

| Qué | Por qué pide cuidado | Cómo se resuelve |
|---|---|---|
| Etiquetas de campo | `<label for>` y `aria-describedby` solo encuentran un `id` dentro de su mismo Shadow DOM | La etiqueta, el campo y el mensaje viven juntos dentro del componente |
| Foco | El foco llega a la etiqueta de fuera, no al control de dentro | `delegatesFocus` lo pasa al control. El contorno de foco está en `src/styles/shared.ts`, porque el CSS de la página no entra |
| Formularios | Un `<form>` no ve los controles de dentro de un Shadow DOM | `ElementInternals`: los campos entregan su valor y su validez al formulario, y `<robur-button type="submit">` lo envía |
| Movimiento reducido | La regla de la página no entra | También está en `shared.ts`, que usan todos los componentes |

## Lo que los tests no cubren

Hay que revisarlo a mano antes de dar un componente por bueno:

- Que el orden del foco tenga sentido y el foco se vea siempre.
- Que los textos (etiquetas, errores) se entiendan sin ver la pantalla.
- La pantalla ampliada al 200 % y con el texto del sistema más grande.
- Un lector de pantalla real: VoiceOver en iOS, TalkBack en Android.
- `HeatmapCell` mide menos de 24 px: el detalle de cada semana debe poder
  alcanzarse también por otra vía.
