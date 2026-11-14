---
paths:
  - "src/patterns/**"
---

# Patrones

- Un patrón combina componentes para resolver una situación que se repite. No dibuja piezas
  nuevas: ni `<button>`, ni `<input>`, ni estilos de control propios. Usa `<robur-button>`,
  `<robur-input>` y el resto de etiquetas del sistema.
- Vive en `src/patterns/<nombre>/` con `<nombre>.ts`, `<nombre>.stories.ts`,
  `<Nombre>.pattern.json` e `index.ts`. Es una clase de Lit, como los componentes.
- El contrato del patrón declara en `components` los componentes que usa. `npm run check` lo
  compara con los imports (`import '../../components/button'`).
- En el CSS de un patrón solo hay disposición (flex, grid, gap, padding), estilos de texto y
  colores de texto. Fondos, bordes, radios y sombras los ponen los componentes.
- Las reglas de un patrón hablan de orden, jerarquía y textos: cuál es la acción principal,
  cuántos toques hacen falta, qué se dice y qué no.
- Si una pantalla necesita algo que ningún patrón cubre y va a repetirse, propón un patrón nuevo.
- Un evento lleva un solo dato en `detail`. Si el aviso lleva dos, van en un objeto:
  `exercise-change` con `{ id, completed }`.
- Un `<form>` dentro del Shadow DOM no ve los campos que llegan por el slot: el patrón envía
  el formulario con su botón y con Intro desde un campo.
