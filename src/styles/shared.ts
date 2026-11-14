import { css } from 'lit'

/**
 * Base de todos los componentes. El CSS de la página no entra en el Shadow DOM: lo que en
 * React y Vue pone index.css para todo (caja, foco, movimiento reducido) cada componente
 * lo trae consigo. Las variables de tokens.css sí entran, porque se heredan.
 */
export const base = css`
  :host {
    font-family: var(--font-sans);
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  :focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }
`
