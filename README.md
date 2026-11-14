# Robur DS (Web Components)

Design System agéntico de Robur, escrito como Web Components con Lit. Es el mismo sistema
que [robur-ds-react](https://github.com/diegosanigle/robur-ds-react): mismos tokens, mismos
contratos y mismos componentes, construidos de forma nativa como etiquetas `<robur-*>` con
Shadow DOM y CSS propio, sin Tailwind.

```bash
npm install
npm run storybook
```

Storybook: https://diegosanigle.github.io/robur-ds-wc/

Figma: https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC (la misma librería que el resto de tecnologías)

Estado: bloque 2. Tokens en dos temas como variables CSS, 11 componentes con contrato y sus
stories, y comprobaciones de contraste, contratos (props, eventos, slots y CSS), paridad con
Figma y accesibilidad en `npm test`.

Los tokens (`tokens/`), los contratos (`*.contract.json` y `*.pattern.json`), `evals/cases.json` y `figma/library.json` no se editan aquí: se cambian en `robur-ds-react` y se copian.

## Usar los componentes

```html
<link rel="stylesheet" href="tokens.css" />
<script type="module">
  import 'robur-ds'
</script>

<robur-button variant="secondary">Cancelar</robur-button>
<robur-input label="Peso (kg)" numeric></robur-input>
```

`tokens.css` se carga una vez en la página: sus variables atraviesan el Shadow DOM de cada
componente.
