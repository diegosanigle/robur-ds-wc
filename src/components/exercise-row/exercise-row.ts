import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../checkbox'

/**
 * Un ejercicio de la sesión: se marca como hecho y, si hace falta, lleva sus campos de registro.
 *
 * @summary Fila de ejercicio.
 * @fires completed-change - Al marcar o desmarcar. `event.detail` es el nuevo estado.
 * @slot - Opcional: los campos de registro (series, repeticiones, peso). Máximo tres.
 */
@customElement('robur-exercise-row')
export class RoburExerciseRow extends LitElement {
  /** Nombre del ejercicio. */
  @property() name!: string
  /** Objetivo del ejercicio, ya formateado: «3 series × 12 reps». */
  @property() target?: string
  /** El ejercicio está hecho. */
  @property({ type: Boolean, reflect: true }) completed!: boolean

  /** @internal Hay campos dentro: si no, su rejilla no ocupa sitio. */
  @state() private hasFields = false

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 3);
        border: 1px solid var(--border-color-default);
        border-radius: var(--radius-md);
        padding: calc(var(--spacing) * 3.5);
        background-color: var(--background-color-surface);
      }
      :host([completed]) .row {
        background-color: var(--background-color-action-soft);
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: calc(var(--spacing) * 2);
      }
      .fields[hidden] {
        display: none;
      }
    `,
  ]

  render() {
    return html`
      <div class="row">
        <robur-checkbox label=${this.name} hint=${this.target ?? ''} .checked=${Boolean(this.completed)} @change=${this.#onChange}></robur-checkbox>
        <div class="fields" ?hidden=${!this.hasFields}>
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
      </div>
    `
  }

  #onSlotChange(event: Event) {
    this.hasFields = (event.target as HTMLSlotElement).assignedElements().length > 0
  }

  #onChange(event: Event) {
    const completed = (event.target as HTMLInputElement).checked
    this.dispatchEvent(new CustomEvent('completed-change', { detail: completed, bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-exercise-row': RoburExerciseRow
  }
}
