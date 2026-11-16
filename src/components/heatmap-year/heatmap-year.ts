import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../heatmap-cell'

/**
 * El heatmap anual: una celda por semana ISO, en rejilla de trece columnas, con su leyenda.
 *
 * @summary Heatmap del año.
 * @fires week-select - Al pulsar una celda. `event.detail` es el número de semana.
 */
@customElement('robur-heatmap-year')
export class RoburHeatmapYear extends LitElement {
  /** Año ISO de las semanas. Da nombre a la rejilla. */
  @property({ type: Number }) year!: number
  /** Una entrada por semana ISO del año, en orden: 52 o 53. */
  @property({ attribute: false }) weeks!: { week: number; sessions: number; level?: number; rest?: boolean; current?: boolean }[]

  static styles = [
    base,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 4);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(13, minmax(0, 1fr));
        gap: calc(var(--spacing) * 1);
      }
      .legend {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: calc(var(--spacing) * 1.5);
        color: var(--text-color-tertiary);
        font-size: var(--text-label);
        line-height: var(--text-label--line-height);
        font-weight: var(--text-label--font-weight);
        letter-spacing: var(--text-label--letter-spacing);
      }
      .swatch {
        width: calc(var(--spacing) * 2.5);
        height: calc(var(--spacing) * 2.5);
        border-radius: var(--radius-xs);
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
    `,
  ]

  render() {
    return html`
      <div role="group" aria-label=${`Semanas de ${this.year}`} class="grid">
        ${(this.weeks ?? []).map(
          (week) => html`
            <robur-heatmap-cell
              week=${week.week}
              sessions=${week.sessions}
              .level=${week.level}
              ?rest=${week.rest}
              ?current=${week.current}
              @click=${() => this.#select(week.week)}
            ></robur-heatmap-cell>
          `,
        )}
      </div>
      <div aria-hidden="true" class="legend">
        <span>menos</span>
        ${[0, 1, 2, 3, 4].map((level) => html`<span class=${`swatch level-${level}`}></span>`)}
        <span>más</span>
      </div>
    `
  }

  #select(week: number) {
    this.dispatchEvent(new CustomEvent('week-select', { detail: week, bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-heatmap-year': RoburHeatmapYear
  }
}
