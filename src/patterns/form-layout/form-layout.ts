import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../../components/button'

/**
 * Un formulario: título, campos y acciones en el orden de siempre.
 *
 * El `<form>` vive en el Shadow DOM y los campos llegan por el slot, así que el navegador no
 * los asocia a él. El patrón envía el formulario con su botón y con Intro desde cualquier campo.
 *
 * @summary Formulario.
 * @fires submit - Al enviar el formulario, con el botón o con la tecla Intro.
 * @fires cancel - Al pulsar el botón de cancelar.
 * @slot - Los campos, en el orden en que se rellenan.
 */
@customElement('robur-form-layout')
export class RoburFormLayout extends LitElement {
  /** Título del formulario. Dice qué se está creando o editando. */
  @property() title!: string
  /** Texto del botón principal: un verbo que dice qué pasa. */
  @property({ attribute: 'submit-label' }) submitLabel!: string
  /** Texto del botón para salir sin guardar. Si no se pasa, no hay botón. */
  @property({ attribute: 'cancel-label' }) cancelLabel?: string
  /** El envío está en curso: bloquea el botón principal. */
  @property({ type: Boolean, reflect: true }) submitting = false

  /** @internal */
  @query('form') private form!: HTMLFormElement

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      form,
      .fields,
      .actions {
        display: flex;
        flex-direction: column;
      }
      form {
        gap: calc(var(--spacing) * 6);
      }
      .fields {
        gap: calc(var(--spacing) * 4);
      }
      .actions {
        gap: calc(var(--spacing) * 2);
      }
      h2 {
        margin: 0;
        color: var(--text-color-primary);
        font-size: var(--text-h2);
        line-height: var(--text-h2--line-height);
        font-weight: var(--text-h2--font-weight);
        letter-spacing: var(--text-h2--letter-spacing);
      }
    `,
  ]

  render() {
    return html`
      <form novalidate @submit=${this.#onSubmit} @keydown=${this.#onKeyDown}>
        <h2>${this.title}</h2>
        <div class="fields"><slot></slot></div>
        <div class="actions">
          <robur-button type="submit" full-width ?loading=${this.submitting}>${this.submitLabel}</robur-button>
          ${this.cancelLabel
            ? html`<robur-button variant="secondary" full-width @click=${this.#cancel}>${this.cancelLabel}</robur-button>`
            : nothing}
        </div>
      </form>
    `
  }

  /** El `submit` nativo no sale del Shadow DOM: quien escucha recibe solo el del patrón. */
  #onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.dispatchEvent(new CustomEvent('submit', { bubbles: true, composed: true }))
  }

  /** Intro en un campo de una línea envía, como en un formulario nativo. */
  #onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.isComposing) return
    const field = event.composedPath()[0]
    if (field instanceof HTMLInputElement && field.type !== 'checkbox') {
      event.preventDefault()
      this.form.requestSubmit()
    }
  }

  #cancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-form-layout': RoburFormLayout
  }
}
