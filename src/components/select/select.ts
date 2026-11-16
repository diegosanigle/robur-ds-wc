import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../icon'

/**
 * Desplegable para elegir una opción de una lista larga o que cambia.
 *
 * Es un `<select>` nativo dentro del Shadow DOM: la lista la abre el sistema operativo. El valor
 * llega al `<form>` de fuera con `ElementInternals`.
 *
 * @summary Desplegable del sistema.
 * @fires change - Al elegir una opción. `event.target.value` es el valor nuevo.
 */
@customElement('robur-select')
export class RoburSelect extends LitElement {
  /** @internal El valor elegido forma parte del `<form>` que lo contiene. */
  static formAssociated = true
  /** @internal El foco pasa al `<select>` de dentro. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  /** Texto visible que nombra el campo. Obligatorio: un campo sin etiqueta no es accesible. */
  @property() label!: string
  /** Las opciones, en el orden en que se muestran. */
  @property({ attribute: false }) options!: { value: string; label: string }[]
  /** Texto de la opción vacía inicial. Si no se pasa, no hay opción vacía. */
  @property() placeholder?: string
  /** Ayuda breve bajo el campo. */
  @property() hint?: string
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  @property() error?: string

  // Atributos nativos del `<select>`. Una etiqueta propia no los tiene: se declaran aquí.
  /** El valor elegido, como el `value` del `<select>` nativo. */
  @property() value = ''
  /** Atributo nativo `name` del campo. */
  @property() name = ''
  /** Atributo nativo `disabled` del campo. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Atributo nativo `required` del campo. */
  @property({ type: Boolean, reflect: true }) required = false

  /** @internal */
  #internals = this.attachInternals()
  /** @internal */
  @query('select') private field!: HTMLSelectElement

  static styles = [
    base,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 1.5);
      }
      label {
        color: var(--text-color-primary);
        font-size: var(--text-control);
        line-height: var(--text-control--line-height);
        font-weight: var(--text-control--font-weight);
        letter-spacing: var(--text-control--letter-spacing);
      }
      .field {
        position: relative;
      }
      select {
        appearance: none;
        min-height: calc(var(--spacing) * 11);
        width: 100%;
        margin: 0;
        border: 1px solid var(--border-color-control);
        border-radius: var(--radius-md);
        background-color: var(--background-color-surface);
        padding: calc(var(--spacing) * 3.5) calc(var(--spacing) * 11) calc(var(--spacing) * 3.5) calc(var(--spacing) * 3.5);
        color: var(--text-color-primary);
        box-shadow: var(--shadow-sm);
        font-family: inherit;
        font-size: var(--text-body);
        line-height: var(--text-body--line-height);
        font-weight: var(--text-body--font-weight);
        letter-spacing: var(--text-body--letter-spacing);
      }
      select:focus {
        border-color: var(--border-color-action);
        outline: none;
        box-shadow:
          0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 20%, transparent),
          var(--shadow-sm);
      }
      select:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      select[aria-invalid='true'] {
        border-color: var(--border-color-danger);
      }
      robur-icon {
        position: absolute;
        top: 50%;
        right: calc(var(--spacing) * 3.5);
        transform: translateY(-50%);
        color: var(--text-color-tertiary);
        pointer-events: none;
      }
      p {
        margin: 0;
        color: var(--text-color-tertiary);
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
      }
      p.error {
        color: var(--text-color-danger);
      }
    `,
  ]

  render() {
    // Un atributo vacío (`error=""`) cuenta como sin mensaje.
    const message = this.error || this.hint
    return html`
      <label for="field">${this.label}</label>
      <div class="field">
        <select
          id="field"
          name=${this.name || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : nothing}
          aria-describedby=${message ? 'message' : nothing}
          @change=${this.#onChange}
        >
          ${this.placeholder !== undefined ? html`<option value="" ?selected=${this.value === ''}>${this.placeholder}</option>` : nothing}
          ${(this.options ?? []).map((option) => html`<option value=${option.value} ?selected=${option.value === this.value}>${option.label}</option>`)}
        </select>
        <robur-icon name="chevron-down"></robur-icon>
      </div>
      ${message ? html`<p id="message" class=${this.error ? 'error' : ''}>${message}</p>` : nothing}
    `
  }

  updated() {
    // El `<form>` de fuera recibe el valor y sabe si el campo es válido.
    this.field.value = this.value
    this.#internals.setFormValue(this.value)
    this.#internals.setValidity(this.field.validity, this.field.validationMessage, this.field)
  }

  /** @internal Vuelve a la opción vacía cuando se vacía el `<form>`. */
  formResetCallback() {
    this.value = ''
  }

  /** @internal Un `<fieldset disabled>` también deshabilita el campo. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  #onChange(event: Event) {
    this.value = (event.target as HTMLSelectElement).value
    // `change` no sale del Shadow DOM por sí solo: se repite en la etiqueta.
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-select': RoburSelect
  }
}
