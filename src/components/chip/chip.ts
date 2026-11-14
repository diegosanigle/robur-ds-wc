import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Una opción que se elige o se destaca.
 *
 * @summary Chip del sistema.
 * @slot - El texto de la opción.
 */
@customElement('robur-chip')
export class RoburChip extends LitElement {
  /** @internal El foco pasa al `<button>` de dentro. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  /** `default` para elegir entre opciones; `accent` para destacar una sin seleccionarla. */
  @property({ reflect: true }) variant: 'default' | 'accent' = 'default'
  /** La opción está elegida. */
  @property({ type: Boolean, reflect: true }) selected = false

  // Atributo nativo del `<button>`. El clic no hace falta declararlo: sale del Shadow DOM.
  /** Atributo nativo `disabled` del botón. */
  @property({ type: Boolean, reflect: true }) disabled = false

  constructor() {
    super()
    // Un chip deshabilitado no deja pasar el clic a quien escucha fuera.
    this.addEventListener(
      'click',
      (event) => {
        if (this.disabled) event.stopImmediatePropagation()
      },
      { capture: true },
    )
  }

  static styles = [
    base,
    css`
      :host {
        display: inline-block;
      }
      button {
        display: inline-flex;
        min-height: calc(var(--spacing) * 11);
        align-items: center;
        justify-content: center;
        border: 1px solid;
        border-radius: var(--radius-pill);
        padding: 0 calc(var(--spacing) * 4);
        font-family: inherit;
        font-size: var(--text-control);
        line-height: var(--text-control--line-height);
        font-weight: var(--text-control--font-weight);
        letter-spacing: var(--text-control--letter-spacing);
        cursor: pointer;
        transition-property: color, background-color, border-color, opacity, transform;
        transition-duration: 150ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      button:active {
        transform: scale(0.95);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        transform: none;
      }
      .default {
        border-color: var(--border-color-default);
        background-color: var(--background-color-surface);
        color: var(--text-color-tertiary);
      }
      .accent {
        border-color: transparent;
        background-color: var(--background-color-action-soft);
        color: var(--text-color-action);
      }
      .selected {
        border-color: transparent;
        background-color: var(--background-color-selected);
        color: var(--text-color-on-selected);
      }
    `,
  ]

  render() {
    return html`
      <button type="button" class=${this.selected ? 'selected' : this.variant} aria-pressed=${this.selected ? 'true' : 'false'} ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-chip': RoburChip
  }
}
