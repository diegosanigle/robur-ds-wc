import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../../components/button'
import '../../components/chip'
import '../../components/exercise-row'

/** Un ejercicio del día, con su estado. */
export interface SessionExercise {
  id: string
  name: string
  target?: string
  completed: boolean
}

/**
 * Registrar una sesión en tres toques: tipo de día, ejercicios hechos y guardar.
 *
 * @summary Registro de sesión.
 * @fires day-type-change - Al pulsar un tipo de día. `event.detail` es el tipo.
 * @fires exercise-change - Al marcar o desmarcar un ejercicio. `event.detail` es `{ id, completed }`.
 * @fires save - Al guardar la sesión.
 */
@customElement('robur-session-log')
export class RoburSessionLog extends LitElement {
  /** Los tipos de día entre los que elegir, en orden. */
  @property({ attribute: false }) dayTypes!: string[]
  /** El tipo de día elegido. */
  @property({ attribute: 'day-type' }) dayType!: string
  /** Los ejercicios del día elegido. */
  @property({ attribute: false }) exercises!: SessionExercise[]
  /** El guardado está en curso. */
  @property({ type: Boolean, reflect: true }) saving = false

  static styles = [
    base,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 6);
      }
      h2 {
        margin: 0;
        color: var(--text-color-primary);
        font-size: var(--text-h2);
        line-height: var(--text-h2--line-height);
        font-weight: var(--text-h2--font-weight);
        letter-spacing: var(--text-h2--letter-spacing);
      }
      [role='group'] {
        display: flex;
        flex-wrap: wrap;
        gap: calc(var(--spacing) * 2);
      }
      ul {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 4);
        margin: 0;
        padding: 0;
        list-style: none;
      }
    `,
  ]

  render() {
    return html`
      <h2>Registrar sesión</h2>
      <div role="group" aria-label="Tipo de día">
        ${(this.dayTypes ?? []).map(
          (type) => html`<robur-chip ?selected=${type === this.dayType} @click=${() => this.#dayType(type)}>${type}</robur-chip>`,
        )}
      </div>
      <ul>
        ${(this.exercises ?? []).map(
          (exercise) => html`
            <li>
              <robur-exercise-row
                name=${exercise.name}
                target=${exercise.target ?? ''}
                ?completed=${exercise.completed}
                @completed-change=${(event: CustomEvent<boolean>) => {
                  // El evento de la fila no sale del patrón: fuera solo se oye exercise-change.
                  event.stopPropagation()
                  this.#exercise(exercise.id, event.detail)
                }}
              ></robur-exercise-row>
            </li>
          `,
        )}
      </ul>
      <robur-button full-width ?loading=${this.saving} @click=${this.#save}>Guardar sesión</robur-button>
    `
  }

  // Cada evento con su nombre escrito: el manifiesto los lee de aquí.
  #dayType(dayType: string) {
    this.dispatchEvent(new CustomEvent('day-type-change', { detail: dayType, bubbles: true, composed: true }))
  }

  #exercise(id: string, completed: boolean) {
    this.dispatchEvent(new CustomEvent('exercise-change', { detail: { id, completed }, bubbles: true, composed: true }))
  }

  #save() {
    this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-session-log': RoburSessionLog
  }
}
