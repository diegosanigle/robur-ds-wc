import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../../components/button'
import '../../components/sheet'

/**
 * Pedir confirmación antes de una acción que no se puede deshacer, como borrar.
 *
 * @summary Confirmación.
 * @fires confirm - Al confirmar.
 * @fires cancel - Al cancelar o al cerrar la hoja.
 */
@customElement('robur-confirm-sheet')
export class RoburConfirmSheet extends LitElement {
  /** La hoja está abierta. */
  @property({ type: Boolean, reflect: true }) open!: boolean
  /** Qué se va a hacer, como pregunta: «¿Borrar esta sesión?». */
  @property() title!: string
  /** Una frase con lo que se pierde. */
  @property() description!: string
  /** Texto del botón que confirma: el verbo de la acción («Borrar sesión»). */
  @property({ attribute: 'confirm-label' }) confirmLabel!: string
  /** La confirmación está en curso: bloquea los botones. */
  @property({ type: Boolean, reflect: true }) loading = false

  // Un patrón solo dispone y escribe texto: fondos, bordes y radios los ponen los componentes.
  static styles = [
    base,
    css`
      :host {
        display: contents;
      }
      p {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: var(--text-body);
        line-height: var(--text-body--line-height);
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 3);
        margin-top: calc(var(--spacing) * 6);
      }
    `,
  ]

  render() {
    return html`
      <robur-sheet ?open=${this.open} .title=${this.title} @close=${this.#cancel}>
        <p>${this.description}</p>
        <div class="actions">
          <robur-button variant="danger" full-width ?loading=${this.loading} @click=${this.#confirm}>${this.confirmLabel}</robur-button>
          <robur-button variant="secondary" full-width ?disabled=${this.loading} @click=${this.#cancel}>Cancelar</robur-button>
        </div>
      </robur-sheet>
    `
  }

  #confirm() {
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }))
  }

  #cancel(event: Event) {
    // El `close` de la hoja de dentro no es de la API de este patrón: se detiene al recibirlo.
    if (event.type === 'close') event.stopPropagation()
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-confirm-sheet': RoburConfirmSheet
  }
}
