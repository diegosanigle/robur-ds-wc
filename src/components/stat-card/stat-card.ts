import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../card'

/**
 * Una cifra destacada con su etiqueta, sobre una tarjeta.
 *
 * @summary Tarjeta de cifra del sistema.
 */
@customElement('robur-stat-card')
export class RoburStatCard extends LitElement {
  /** Qué mide la cifra. */
  @property() label!: string
  /** La cifra, ya formateada. */
  @property() value!: string
  /** Unidad, junto a la cifra y más pequeña. */
  @property() unit?: string
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  @property({ reflect: true }) variant: 'surface' | 'inverse' = 'surface'
  /** Color de la cifra en la variante `inverse`: serie principal o segunda serie. */
  @property({ reflect: true }) series: 'primary' | 'secondary' = 'primary'

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      robur-card {
        height: 100%;
      }
      p {
        margin: 0;
      }
      .label {
        color: var(--text-color-tertiary);
        text-transform: uppercase;
        font-size: var(--text-label);
        line-height: var(--text-label--line-height);
        font-weight: var(--text-label--font-weight);
        letter-spacing: var(--text-label--letter-spacing);
      }
      .value {
        margin-top: calc(var(--spacing) * 2);
        font-variant-numeric: tabular-nums;
        font-size: var(--text-h1);
        line-height: var(--text-h1--line-height);
        font-weight: var(--text-h1--font-weight);
        letter-spacing: var(--text-h1--letter-spacing);
      }
      .unit {
        margin-left: calc(var(--spacing) * 1);
        color: var(--text-color-tertiary);
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
        letter-spacing: var(--text-title--letter-spacing);
      }
      :host([variant='inverse']) .label,
      :host([variant='inverse']) .unit {
        color: var(--text-color-on-inverse-muted);
      }
      :host([variant='inverse']) .value {
        color: var(--color-data-1);
      }
      :host([variant='inverse'][series='secondary']) .value {
        color: var(--color-data-2);
      }
    `,
  ]

  render() {
    return html`
      <robur-card variant=${this.variant}>
        <p class="label">${this.label}</p>
        <p class="value">${this.value}${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}</p>
      </robur-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-stat-card': RoburStatCard
  }
}
