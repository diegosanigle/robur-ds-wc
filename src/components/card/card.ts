import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Agrupa contenido relacionado sobre una superficie.
 *
 * @summary Tarjeta del sistema.
 * @slot - El contenido de la tarjeta.
 */
@customElement('robur-card')
export class RoburCard extends LitElement {
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  @property({ reflect: true }) variant: 'surface' | 'inverse' = 'surface'
  /** Espacio interior: `md` son 20 px y `lg` son 24 px, para la tarjeta destacada. */
  @property({ reflect: true }) padding: 'md' | 'lg' = 'md'

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      /* Dentro de una rejilla, la tarjeta se estira a la altura de la fila, como un <div>. */
      div {
        height: 100%;
        border-radius: var(--radius-lg);
        padding: calc(var(--spacing) * 5);
      }
      .lg {
        padding: calc(var(--spacing) * 6);
      }
      .surface {
        background-color: var(--background-color-surface);
        color: var(--text-color-primary);
      }
      .inverse {
        background-color: var(--background-color-inverse);
        color: var(--text-color-on-inverse);
      }
    `,
  ]

  render() {
    return html`<div class="${this.variant} ${this.padding}"><slot></slot></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-card': RoburCard
  }
}
