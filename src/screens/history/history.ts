import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../../components/card'
import '../../components/stat-card'
import '../../components/tabs'
import '../../patterns/empty-state'

const PERIODS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'ano', label: 'Año' },
]

export interface HistorySummary {
  sessions: string
  volume: string
  maxWeight: string
}

export interface HistorySession {
  id: string
  date: string
  dayType: string
  detail: string
}

/**
 * El historial de sesiones de un periodo, compuesto solo con piezas del sistema.
 *
 * @summary Pantalla de historial.
 * @fires period-change - Al elegir un periodo. `event.detail` es el periodo.
 * @fires log-session - Al pulsar la acción del estado vacío.
 */
@customElement('robur-history')
export class RoburHistory extends LitElement {
  /** Periodo que se está viendo. */
  @property() period!: string
  /** Las tres cifras del periodo, ya formateadas. */
  @property({ attribute: false }) summary!: HistorySummary
  /** Las sesiones del periodo, de la más reciente a la más antigua. */
  @property({ attribute: false }) sessions!: HistorySession[]

  // Una pantalla solo dispone y escribe texto: el aspecto lo ponen las piezas.
  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      main,
      .period,
      ul {
        display: flex;
        flex-direction: column;
      }
      main {
        max-width: calc(var(--spacing) * 120);
        margin: 0 auto;
        gap: calc(var(--spacing) * 8);
        padding: calc(var(--spacing) * 6) calc(var(--spacing) * 5);
      }
      h1 {
        margin: 0;
        color: var(--text-color-primary);
        font-size: var(--text-h1);
        line-height: var(--text-h1--line-height);
        font-weight: var(--text-h1--font-weight);
        letter-spacing: var(--text-h1--letter-spacing);
      }
      .period {
        gap: calc(var(--spacing) * 8);
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: calc(var(--spacing) * 4);
      }
      .wide {
        grid-column: span 2;
      }
      ul {
        gap: calc(var(--spacing) * 4);
        margin: 0;
        padding: 0;
        list-style: none;
      }
      p {
        margin: 0;
      }
      .date {
        color: var(--text-color-tertiary);
        text-transform: uppercase;
        font-size: var(--text-label);
        line-height: var(--text-label--line-height);
        font-weight: var(--text-label--font-weight);
        letter-spacing: var(--text-label--letter-spacing);
      }
      .day {
        margin-top: calc(var(--spacing) * 1);
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
        letter-spacing: var(--text-title--letter-spacing);
      }
      .detail {
        color: var(--text-color-secondary);
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
      }
    `,
  ]

  render() {
    const summary = this.summary ?? { sessions: '0', volume: '0', maxWeight: '0' }
    const sessions = this.sessions ?? []
    return html`
      <main>
        <h1>Historial</h1>
        <robur-tabs label="Periodo" .tabs=${PERIODS} value=${this.period} @change=${this.#onPeriod}>
          <div class="period">
            <div class="stats">
              <div class="wide"><robur-stat-card variant="inverse" label="Sesiones" value=${summary.sessions}></robur-stat-card></div>
              <robur-stat-card label="Volumen" value=${summary.volume} unit="kg"></robur-stat-card>
              <robur-stat-card label="Peso máximo" value=${summary.maxWeight} unit="kg"></robur-stat-card>
            </div>
            ${sessions.length
              ? html`<ul>
                  ${sessions.map(
                    (session) => html`
                      <li>
                        <robur-card>
                          <p class="date">${session.date}</p>
                          <p class="day">${session.dayType}</p>
                          <p class="detail">${session.detail}</p>
                        </robur-card>
                      </li>
                    `,
                  )}
                </ul>`
              : html`<robur-empty-state
                  .title=${'Aún no hay sesiones en este periodo'}
                  description="Cuando registres una, aparecerá aquí."
                  action-label="Registrar sesión"
                  @action=${this.#onLogSession}
                ></robur-empty-state>`}
          </div>
        </robur-tabs>
      </main>
    `
  }

  #onPeriod(event: CustomEvent<string>) {
    // El cambio de pestaña se convierte en el evento de la pantalla.
    event.stopPropagation()
    this.dispatchEvent(new CustomEvent('period-change', { detail: event.detail, bubbles: true, composed: true }))
  }

  #onLogSession(event: Event) {
    event.stopPropagation()
    this.dispatchEvent(new CustomEvent('log-session', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-history': RoburHistory
  }
}
