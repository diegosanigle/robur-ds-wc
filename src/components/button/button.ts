import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Lanza una acción: guardar, cancelar, borrar.
 *
 * @summary Botón del sistema.
 * @slot - El texto del botón.
 */
@customElement('robur-button')
export class RoburButton extends LitElement {
  /** @internal Participa en el `<form>` que lo contiene, como un `<button>` nativo. */
  static formAssociated = true
  /** @internal El foco pasa al `<button>` de dentro. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  /** Jerarquía visual. Solo un `primary` por pantalla. */
  @property({ reflect: true }) variant: 'primary' | 'secondary' | 'danger' = 'primary'
  /** Ocupa todo el ancho del contenedor. Atributo: `full-width`. */
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false
  /** Muestra que la acción está en curso y bloquea nuevos clics. */
  @property({ type: Boolean, reflect: true }) loading = false

  // Atributos nativos del `<button>`. Una etiqueta propia no los tiene: se declaran aquí.
  // El clic no hace falta declararlo: el de dentro sale del Shadow DOM y llega a `<robur-button>`.
  /** Atributo nativo `type` del botón. */
  @property() type: 'button' | 'submit' | 'reset' = 'button'
  /** Atributo nativo `disabled` del botón. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** @internal */
  #internals = this.attachInternals()

  constructor() {
    super()
    // Un botón deshabilitado o cargando no deja pasar el clic a quien escucha fuera.
    this.addEventListener(
      'click',
      (event) => {
        if (this.disabled || this.loading) {
          event.preventDefault()
          event.stopImmediatePropagation()
        }
      },
      { capture: true },
    )
  }

  static styles = [
    base,
    css`
      /* La etiqueta es una caja flexible: si una fila la estira, el <button> de dentro la llena. */
      :host {
        display: inline-flex;
      }
      :host([full-width]) {
        display: flex;
      }
      button {
        display: inline-flex;
        min-height: calc(var(--spacing) * 11);
        align-items: center;
        justify-content: center;
        gap: calc(var(--spacing) * 2);
        border: 0;
        border-radius: var(--radius-pill);
        padding: calc(var(--spacing) * 3.5) calc(var(--spacing) * 6);
        font-family: inherit;
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
        letter-spacing: var(--text-title--letter-spacing);
        cursor: pointer;
        transition-property: color, background-color, border-color, opacity, transform;
        transition-duration: 150ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      button:active {
        transform: scale(0.98);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        transform: none;
      }
      :host([full-width]) button {
        width: 100%;
      }
      .primary {
        background-color: var(--background-color-action);
        color: var(--text-color-on-action);
      }
      .secondary {
        border: 1px solid var(--border-color-strong);
        background-color: transparent;
        color: var(--text-color-primary);
      }
      .danger {
        border: 1px solid var(--border-color-danger);
        background-color: transparent;
        color: var(--text-color-danger);
      }
    `,
  ]

  render() {
    return html`
      <button
        type="button"
        class=${this.variant}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : nothing}
        @click=${this.#submit}
      >
        ${this.loading ? 'Guardando…' : html`<slot></slot>`}
      </button>
    `
  }

  /** Un `<button>` dentro del Shadow DOM no envía el formulario de fuera: lo hace el componente. */
  #submit() {
    const form = this.#internals.form
    if (!form) return
    if (this.type === 'submit') form.requestSubmit()
    if (this.type === 'reset') form.reset()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-button': RoburButton
  }
}
