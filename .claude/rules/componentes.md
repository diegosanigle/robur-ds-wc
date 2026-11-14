---
paths:
  - "src/components/**"
---

# Componentes

- Cada componente vive en `src/components/<nombre>/`, en kebab-case, con cuatro ficheros:
  `<nombre>.ts`, `<nombre>.stories.ts`, `<Nombre>.contract.json` e `index.ts`. Se exporta desde
  `src/index.ts`.
- Para crear uno nuevo, sigue la skill `/nuevo-componente`: primero el contrato, después el código.
- El contrato se cambia en el mismo commit que el código. `npm run check` compara los dos a
  través de `custom-elements.json`.
- Nombres: el componente en PascalCase (`StatCard`) en el contrato, en Figma y en la
  documentación; su clase lleva el prefijo (`RoburStatCard`) y su etiqueta es
  `robur-stat-card`. Props en camelCase; como atributo, en kebab-case (`full-width`). Variantes
  por función (`danger`, no `red`); booleanos como adjetivo sin `is` (`selected`). La selección
  y el deshabilitado son estados, no variantes.
- Un componente es una clase de Lit con `@customElement('robur-<nombre>')`, Shadow DOM y su CSS
  en `static styles`, que empieza por `base` de `src/styles/shared.ts`: el CSS de la página no
  entra en el Shadow DOM, así que la caja, el foco visible y el movimiento reducido van ahí.
- En el CSS solo hay `var(--…)` de tokens semánticos y `calc(var(--spacing) * N)` para los
  espacios. Si necesitas un color, un radio o un tamaño que no existe, para y propón el token.
- Las props van con `@property()`. Las obligatorias se declaran sin valor (`label!: string`);
  las opcionales sin valor, con `?`. Las listas, con `attribute: false`. Los eventos se
  anuncian con `@fires nombre - Cuándo.` en el comentario de la clase y se lanzan con
  `new CustomEvent('nombre', { detail, bubbles: true, composed: true })`, cada uno con su
  nombre escrito, no en una variable. El contenido es el slot por defecto, anotado con
  `@slot - Qué va dentro.`; si es opcional, el comentario empieza por «Opcional».
- Cada prop lleva un comentario de una línea encima: es su documentación. Lo que no es una
  prop va privado o marcado con `@internal`. En los comentarios, las etiquetas van entre
  comillas invertidas (`` `<input>` ``): si no, Storybook las pinta.
- El contrato usa nombres neutros: un evento `completed-change` se anota como la prop función
  `onCompletedChange` y el slot como la prop `children`.
- Los atributos del elemento nativo de dentro no llegan solos a él. Los que hagan falta
  (`disabled`, `type`, `value`) se declaran como propiedades y se pasan a mano. No se anotan
  en el contrato: los cubre `extends`. El clic no se declara: sale del Shadow DOM.
- Un control que participa en formularios es `formAssociated` y usa `ElementInternals`: su
  valor llega al `<form>` de fuera, un botón `submit` lo envía e Intro en un campo también.
  `change` no sale del Shadow DOM: se repite en la etiqueta. El foco pasa al control de dentro
  con `delegatesFocus`.
- Si la etiqueta puede estirarse (en una rejilla o una fila), la caja de dentro la llena.
- No llames a un evento como uno nativo que pueda subir desde el contenido (`change`, `submit`).
  Si el contrato obliga, detén el nativo dentro del componente. Un evento de un componente de
  dentro que no es de la API se detiene al recibirlo.
- Cada variante y cada estado tienen su story. Los componentes interactivos tienen además una
  story `Interaccion` que usa el componente como lo haría una persona y comprueba el resultado.
  Los tests entran en el Shadow DOM con `inside()` de `src/stories/shadow.ts`.
- Antes de programar un comportamiento, usa el que ya da el navegador: `<dialog>`, `<input>`,
  `<button>`, `<nav>`.
- Zona pulsable de 44 px de alto como mínimo. Todo control tiene un nombre accesible.
- Si un componente usa otro del sistema, se importa (`import '../card'`) y se declara en
  `composes`. No se copian estilos.
- Si cambian las props, hay que llevar el cambio a Figma: skill `/sincronizar-figma`.
