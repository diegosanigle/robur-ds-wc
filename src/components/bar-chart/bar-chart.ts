import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { base } from '../../styles/shared'
import '../card'

const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

/**
 * Gráfica de barras en una tarjeta: una cifra por periodo, con su valor encima.
 *
 * @summary Gráfica de barras.
 */
@customElement('robur-bar-chart')
export class RoburBarChart extends LitElement {
  /** Qué mide la gráfica. Es su título visible y su nombre. */
  @property() title!: string
  /** Una barra por elemento, en orden: la etiqueta va debajo y la cifra encima. */
  @property({ attribute: false }) data!: { label: string; value: number }[]
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  @property({ reflect: true }) variant: 'surface' | 'inverse' = 'surface'
  /** Color de las barras: serie principal o segunda serie (solo en `inverse`). */
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
      .plot {
        display: flex;
        height: calc(var(--spacing) * 40);
        align-items: flex-end;
        gap: calc(var(--spacing) * 1);
        padding-top: calc(var(--spacing) * 5);
      }
      .column {
        display: flex;
        height: 100%;
        min-width: 0;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: calc(var(--spacing) * 1);
      }
      .bar {
        width: 100%;
        flex-shrink: 0;
        border-radius: var(--radius-xs) var(--radius-xs) 0 0;
        background-color: var(--color-data-1);
      }
      :host([series='secondary']) .bar {
        background-color: var(--color-data-2);
      }
      .labels {
        display: flex;
        gap: calc(var(--spacing) * 1);
      }
      .labels span {
        min-width: 0;
        flex: 1;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .figure,
      .labels span {
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
    const max = Math.max(...data.map((d) => d.value), 0) || 1
    return html`
      <robur-card variant=${this.variant}>
        <figure aria-label=${this.title}>
          <figcaption>${this.title}</figcaption>
          <div aria-hidden="true" class="plot">
            ${data.map(
              (d) => html`
                <div class="column">
                  <span class="figure">${d.value > 0 ? number.format(d.value) : ''}</span>
                  <span class="bar" style=${styleMap({ height: `${(d.value / max) * 100}%` })}></span>
                </div>
              `,
            )}
          </div>
          <div aria-hidden="true" class="labels">${data.map((d) => html`<span>${d.label}</span>`)}</div>
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
    'robur-bar-chart': RoburBarChart
  }
}
