import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Una semana del mapa de calor: su color dice cuántas sesiones hubo.
 *
 * @summary Celda del mapa de calor.
 */
@customElement('robur-heatmap-cell')
export class RoburHeatmapCell extends LitElement {
  /** @internal El foco pasa al `<button>` de dentro. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  /** Número de semana ISO, del 1 al 53. */
  @property({ type: Number }) week!: number
  /** Sesiones registradas esa semana. Decide el nivel de color. */
  @property({ type: Number }) sessions!: number
  /** Semana marcada como descanso: se distingue por el borde discontinuo, no por un color. */
  @property({ type: Boolean, reflect: true }) rest = false
  /** Es la semana en curso. */
  @property({ type: Boolean, reflect: true }) current = false

  // Atributo nativo del `<button>`. El clic no hace falta declararlo: sale del Shadow DOM.
  /** Atributo nativo `disabled` del botón. */
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      button {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        min-height: calc(var(--spacing) * 3.5);
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: var(--radius-xs);
        cursor: pointer;
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      button:active {
        transform: scale(0.95);
      }
      .level-0 {
        background-color: var(--color-heat-0);
      }
      .level-1 {
        background-color: var(--color-heat-1);
      }
      .level-2 {
        background-color: var(--color-heat-2);
      }
      .level-3 {
        background-color: var(--color-heat-3);
      }
      .level-4 {
        background-color: var(--color-heat-4);
      }
      .rest {
        border: 1px dashed var(--border-color-control);
        background-color: var(--background-color-surface);
      }
      :host([current]) button {
        outline: 2px solid var(--color-heat-current);
        outline-offset: 2px;
      }
    `,
  ]

  render() {
    const detail = this.rest ? 'descanso' : `${this.sessions} ${this.sessions === 1 ? 'sesión' : 'sesiones'}`
    const level = Math.min(Math.max(this.sessions, 0), 4)
    return html`
      <button
        type="button"
        class=${this.rest ? 'rest' : `level-${level}`}
        aria-label=${`Semana ${this.week}, ${detail}${this.current ? ', semana actual' : ''}`}
        ?disabled=${this.disabled}
      ></button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-heatmap-cell': RoburHeatmapCell
  }
}
