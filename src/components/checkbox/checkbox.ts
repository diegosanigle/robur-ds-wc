import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Casilla para marcar algo como hecho.
 *
 * La etiqueta, la casilla y el detalle viven en el mismo Shadow DOM. Su estado llega al
 * `<form>` de fuera con `ElementInternals`, como el de un `<input type="checkbox">` nativo.
 *
 * @summary Casilla del sistema.
 * @fires change - Al marcar o desmarcar. `event.target.checked` es el estado nuevo.
 */
@customElement('robur-checkbox')
export class RoburCheckbox extends LitElement {
  /** @internal La casilla forma parte del `<form>` que la contiene. */
  static formAssociated = true
  /** @internal El foco pasa al `<input>` de dentro. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  /** Texto visible que nombra la casilla. Obligatorio: una casilla sin etiqueta no es accesible. */
  @property() label!: string
  /** Detalle breve bajo la etiqueta. */
  @property() hint?: string

  // Atributos nativos del `<input>`. Una etiqueta propia no los tiene: se declaran aquí.
  /** Si está marcada, como el `checked` del `<input>` nativo. */
  @property({ type: Boolean }) checked = false
  /** Atributo nativo `name` de la casilla. */
  @property() name = ''
  /** Atributo nativo `value`: lo que envía el formulario si está marcada. */
  @property() value = 'on'
  /** Atributo nativo `disabled` de la casilla. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** @internal */
  #internals = this.attachInternals()

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      label {
        display: flex;
        min-height: calc(var(--spacing) * 11);
        cursor: pointer;
        align-items: center;
        gap: calc(var(--spacing) * 3);
      }
      .box {
        display: grid;
        width: calc(var(--spacing) * 6);
        height: calc(var(--spacing) * 6);
        flex-shrink: 0;
        place-items: center;
      }
      input,
      svg {
        grid-area: 1 / 1;
      }
      input {
        appearance: none;
        width: calc(var(--spacing) * 6);
        height: calc(var(--spacing) * 6);
        margin: 0;
        cursor: pointer;
        border: 1px solid var(--border-color-control);
        border-radius: var(--radius-xs);
        background-color: var(--background-color-surface);
      }
      input:checked {
        border-color: transparent;
        background-color: var(--background-color-action);
      }
      input:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      svg {
        display: none;
        width: calc(var(--spacing) * 4);
        height: calc(var(--spacing) * 4);
        pointer-events: none;
        color: var(--text-color-on-action);
      }
      input:checked + svg {
        display: block;
      }
      .text {
        display: flex;
        flex-direction: column;
      }
      #label {
        color: var(--text-color-primary);
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
        letter-spacing: var(--text-title--letter-spacing);
      }
      #hint {
        color: var(--text-color-secondary);
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
      }
    `,
  ]

  render() {
    return html`
      <label for="box">
        <span class="box">
          <input
            id="box"
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            aria-labelledby="label"
            aria-describedby=${this.hint ? 'hint' : nothing}
            @change=${this.#onChange}
          />
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8.5l3.5 3.5L13 5" />
          </svg>
        </span>
        <span class="text">
          <span id="label">${this.label}</span>
          ${this.hint ? html`<span id="hint">${this.hint}</span>` : nothing}
        </span>
      </label>
    `
  }

  updated() {
    // El formulario recibe `value` solo si está marcada, como con una casilla nativa.
    this.#internals.setFormValue(this.checked ? this.value : null)
  }

  /** @internal Desmarca la casilla cuando se vacía el `<form>`. */
  formResetCallback() {
    this.checked = false
  }

  /** @internal Un `<fieldset disabled>` también deshabilita la casilla. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  #onChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked
    // `change` no sale del Shadow DOM por sí solo: se repite en la etiqueta.
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-checkbox': RoburCheckbox
  }
}
