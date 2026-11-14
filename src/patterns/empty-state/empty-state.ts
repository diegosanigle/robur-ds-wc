import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../../components/button'

/**
 * Lo que se ve cuando aún no hay nada: qué habrá aquí y cómo empezar.
 *
 * @summary Estado vacío.
 * @fires action - Al pulsar el botón.
 */
@customElement('robur-empty-state')
export class RoburEmptyState extends LitElement {
  /** Qué habrá aquí. En neutro: nunca como un fallo de la persona. */
  @property() title!: string
  /** Una frase que dice cómo empezar. */
  @property() description!: string
  /** Texto del botón. Si no se pasa, no hay acción. */
  @property({ attribute: 'action-label' }) actionLabel?: string

  // Un patrón solo dispone y escribe texto: fondos, bordes y radios los ponen los componentes.
  static styles = [
    base,
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(var(--spacing) * 2);
        padding: calc(var(--spacing) * 8) calc(var(--spacing) * 5);
        text-align: center;
      }
      h2 {
        margin: 0;
        color: var(--text-color-primary);
        font-size: var(--text-h3);
        line-height: var(--text-h3--line-height);
        font-weight: var(--text-h3--font-weight);
        letter-spacing: var(--text-h3--letter-spacing);
      }
      p {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: var(--text-body);
        line-height: var(--text-body--line-height);
      }
      .action {
        margin-top: calc(var(--spacing) * 4);
      }
    `,
  ]

  render() {
    return html`
      <h2>${this.title}</h2>
      <p>${this.description}</p>
      ${this.actionLabel
        ? html`<div class="action"><robur-button @click=${this.#act}>${this.actionLabel}</robur-button></div>`
        : nothing}
    `
  }

  #act() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-empty-state': RoburEmptyState
  }
}
