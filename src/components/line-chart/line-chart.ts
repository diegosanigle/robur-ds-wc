import { LitElement, css, html, nothing, svg } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { base } from '../../styles/shared'
import '../card'

const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

/**
 * Gráfica de línea en una tarjeta: cómo cambia una cifra registro a registro.
 *
 * @summary Gráfica de línea.
 */
@customElement('robur-line-chart')
export class RoburLineChart extends LitElement {
  /** Qué mide la gráfica, con su unidad. Es su título visible y su nombre. */
  @property() title!: string
  /** Un punto por registro, en orden: la etiqueta es la fecha y value la cifra. */
  @property({ attribute: false }) data!: { label: string; value: number }[]
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  @property({ reflect: true }) variant: 'surface' | 'inverse' = 'surface'
  /** Color de la línea: serie principal o segunda serie (solo en `inverse`). */
  @property({ reflect: true }) series: 'primary' | 'secondary' = 'primary'

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      figure {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 3);
        margin: 0;
        color: var(--text-color-tertiary);
      }
      :host([variant='inverse']) figure {
        color: var(--text-color-on-inverse-muted);
      }
      figcaption {
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
        letter-spacing: var(--text-title--letter-spacing);
      }
      .chart {
        display: flex;
        height: calc(var(--spacing) * 40);
        gap: calc(var(--spacing) * 3);
      }
      .plot {
        position: relative;
        min-width: 0;
        flex: 1;
        color: var(--color-data-1);
      }
      :host([series='secondary']) .plot {
        color: var(--color-data-2);
      }
      svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .dot {
        position: absolute;
        width: calc(var(--spacing) * 2);
        height: calc(var(--spacing) * 2);
        border-radius: var(--radius-pill);
        background-color: currentColor;
        transform: translate(-50%, -50%);
      }
      .range {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: right;
      }
      .dates {
        display: flex;
        justify-content: space-between;
      }
      .range,
      .dates {
        font-variant-numeric: tabular-nums;
        font-size: var(--text-label);
        line-height: var(--text-label--line-height);
        font-weight: var(--text-label--font-weight);
        letter-spacing: var(--text-label--letter-spacing);
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    `,
  ]

  render() {
    const data = this.data ?? []
    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    // Un margen del 10 % arriba y abajo para que los puntos no toquen el borde.
    const pad = (max - min || Math.abs(max) || 1) * 0.1
    const top = max + pad
    const bottom = min - pad
    const points = data.map((d, i) => ({
      x: data.length === 1 ? 50 : (i / (data.length - 1)) * 100,
      y: ((top - d.value) / (top - bottom)) * 100,
    }))
    return html`
      <robur-card variant=${this.variant}>
        <figure aria-label=${this.title}>
          <figcaption>${this.title}</figcaption>
          <div aria-hidden="true" class="chart">
            <div class="plot">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                ${svg`<polyline
                  points=${points.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                  vector-effect="non-scaling-stroke"
                />`}
              </svg>
              ${points.map((p) => html`<span class="dot" style=${styleMap({ left: `${p.x}%`, top: `${p.y}%` })}></span>`)}
            </div>
            ${data.length ? html`<div class="range"><span>${number.format(max)}</span><span>${number.format(min)}</span></div>` : nothing}
          </div>
          ${data.length
            ? html`<div aria-hidden="true" class="dates">
                <span>${data[0].label}</span>${data.length > 1 ? html`<span>${data[data.length - 1].label}</span>` : nothing}
              </div>`
            : nothing}
          <table class="sr-only">
            <tbody>
              ${data.map((d) => html`<tr><th scope="row">${d.label}</th><td>${number.format(d.value)}</td></tr>`)}
            </tbody>
          </table>
        </figure>
      </robur-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-line-chart': RoburLineChart
  }
}
