import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import { watchListeners } from '../../utils/listeners'
import '../../components/button'

/**
 * Lo que se ve mientras una pantalla carga sus datos o cuando no han podido llegar.
 *
 * @summary Carga y error de una pantalla.
 * @fires retry - Al pulsar Reintentar. Si nadie lo escucha, el error no ofrece reintento.
 */
@customElement('robur-screen-state')
export class RoburScreenState extends LitElement {
  /** `loading` mientras llegan los datos; `error` si no han podido llegar. */
  @property({ reflect: true }) state!: 'loading' | 'error'
  /** Qué ha pasado y qué hacer, en una frase. Solo en `error`. */
  @property() message?: string

  /** @internal Alguien escucha `retry`. */
  #retryable = watchListeners(this, 'retry', () => this.requestUpdate())

  // Un patrón solo dispone y escribe texto: fondos, bordes y radios los ponen los componentes.
  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      .loading,
      .error {
        padding: calc(var(--spacing) * 8) calc(var(--spacing) * 5);
        text-align: center;
      }
      .loading {
        color: var(--text-color-tertiary);
        font-size: var(--text-body);
        line-height: var(--text-body--line-height);
      }
      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(var(--spacing) * 2);
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
    if (this.state === 'loading') return html`<div role="status" class="loading">Cargando…</div>`
    return html`
      <div role="alert" class="error">
        <h2>No se han podido cargar los datos</h2>
        <p>${this.message ?? 'Comprueba la conexión y vuelve a intentarlo.'}</p>
        ${this.#retryable()
          ? html`<div class="action"><robur-button variant="secondary" @click=${this.#retry}>Reintentar</robur-button></div>`
          : nothing}
      </div>
    `
  }

  #retry() {
    this.dispatchEvent(new CustomEvent('retry', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-screen-state': RoburScreenState
  }
}
