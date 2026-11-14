import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Campo de una línea para escribir texto o una cifra.
 *
 * La etiqueta, el campo y el mensaje viven en el mismo Shadow DOM, así que la etiqueta y
 * `aria-describedby` funcionan sin ids globales. El valor llega al `<form>` de fuera con
 * `ElementInternals`, como el de un `<input>` nativo.
 *
 * @summary Campo de texto del sistema.
 * @fires input - Cada vez que cambia el texto. `event.target.value` es el valor nuevo.
 * @fires change - Al confirmar el valor (perder el foco o pulsar Intro).
 */
@customElement('robur-input')
export class RoburInput extends LitElement {
  /** @internal El valor del campo forma parte del `<form>` que lo contiene. */
  static formAssociated = true
  /** @internal El foco pasa al `<input>` de dentro. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  /** Texto visible que nombra el campo. Obligatorio: un campo sin etiqueta no es accesible. */
  @property() label!: string
  /** Ayuda breve bajo el campo. */
  @property() hint?: string
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  @property() error?: string
  /** Campo de cifra de sesión: texto grande, alineado a la derecha y teclado numérico. */
  @property({ type: Boolean, reflect: true }) numeric = false

  // Atributos nativos del `<input>`. Una etiqueta propia no los tiene: se declaran aquí.
  /** El valor del campo, como el `value` del `<input>` nativo. */
  @property() value = ''
  /** Atributo nativo `type` del campo. */
  @property() type = 'text'
  /** Atributo nativo `name` del campo. */
  @property() name = ''
  /** Atributo nativo `placeholder`: un ejemplo, nunca la etiqueta. */
  @property() placeholder?: string
  /** Atributo nativo `autocomplete` del campo. */
  @property() autocomplete?: string
  /** Atributo nativo `disabled` del campo. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Atributo nativo `readonly` del campo (propiedad `readOnly`, como en el `<input>` nativo). */
  @property({ type: Boolean, reflect: true, attribute: 'readonly' }) readOnly = false
  /** Atributo nativo `required` del campo. */
  @property({ type: Boolean, reflect: true }) required = false

  /** @internal */
  #internals = this.attachInternals()
  /** @internal */
  @query('input') private field!: HTMLInputElement

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
      input {
        min-height: calc(var(--spacing) * 11);
        width: 100%;
        margin: 0;
        border: 1px solid var(--border-color-control);
        border-radius: var(--radius-md);
        background-color: var(--background-color-surface);
        padding: calc(var(--spacing) * 3.5);
        color: var(--text-color-primary);
        box-shadow: var(--shadow-sm);
        font-family: inherit;
        font-size: var(--text-body);
        line-height: var(--text-body--line-height);
        font-weight: var(--text-body--font-weight);
        letter-spacing: var(--text-body--letter-spacing);
      }
      input::placeholder {
        color: var(--text-color-tertiary);
      }
      input:focus {
        border-color: var(--border-color-action);
        outline: none;
        box-shadow:
          0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 20%, transparent),
          var(--shadow-sm);
      }
      input:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      input[aria-invalid='true'] {
        border-color: var(--border-color-danger);
      }
      :host([numeric]) input {
        text-align: right;
        font-size: var(--text-h3);
        line-height: var(--text-h3--line-height);
        font-weight: var(--text-h3--font-weight);
        letter-spacing: var(--text-h3--letter-spacing);
        font-variant-numeric: tabular-nums;
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
      <input
        id="field"
        type=${this.type}
        .value=${this.value}
        name=${this.name || nothing}
        placeholder=${this.placeholder ?? nothing}
        autocomplete=${(this.autocomplete as AutoFill | undefined) ?? nothing}
        ?disabled=${this.disabled}
        ?readonly=${this.readOnly}
        ?required=${this.required}
        inputmode=${this.numeric ? 'decimal' : nothing}
        aria-invalid=${this.error ? 'true' : nothing}
        aria-describedby=${message ? 'message' : nothing}
        @input=${this.#onInput}
        @change=${this.#onChange}
      />
      ${message ? html`<p id="message" class=${this.error ? 'error' : ''}>${message}</p>` : nothing}
    `
  }

  updated() {
    // El `<form>` de fuera recibe el valor y sabe si el campo es válido.
    this.#internals.setFormValue(this.value)
    this.#internals.setValidity(this.field.validity, this.field.validationMessage, this.field)
  }

  /** @internal Vacía el campo cuando se vacía el `<form>`. */
  formResetCallback() {
    this.value = ''
  }

  /** @internal Un `<fieldset disabled>` también deshabilita el campo. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  #onInput(event: Event) {
    // El evento `input` sale solo del Shadow DOM; antes de que llegue fuera, el valor ya está al día.
    this.value = (event.target as HTMLInputElement).value
  }

  #onChange() {
    // `change` no sale del Shadow DOM por sí solo: se repite en la etiqueta.
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-input': RoburInput
  }
}
