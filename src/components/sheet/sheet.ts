import { LitElement, css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/**
 * Hoja que sube desde abajo, encima de la pantalla, para una tarea corta.
 *
 * Usa un `<dialog>` con `showModal()`: atrapa el foco, cierra con Escape y devuelve el foco
 * a quien la abrió.
 *
 * @summary Hoja modal del sistema.
 * @fires close - Cuando la persona cierra la hoja: botón, tecla Escape o toque fuera.
 * @slot - El contenido de la hoja.
 */
@customElement('robur-sheet')
export class RoburSheet extends LitElement {
  /** La hoja está abierta. */
  @property({ type: Boolean, reflect: true }) open!: boolean
  /** Título visible. Obligatorio: es el nombre de la hoja para lectores de pantalla. */
  @property() title!: string

  /** @internal */
  @query('dialog') private dialog!: HTMLDialogElement

  static styles = [
    base,
    css`
      dialog {
        position: fixed;
        inset: auto 0 0 0;
        width: 100%;
        max-width: calc(var(--spacing) * 120);
        margin: 0 auto;
        border: 0;
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        padding: 0;
        background-color: var(--background-color-surface);
        color: var(--text-color-primary);
        box-shadow: var(--shadow-md);
      }
      dialog::backdrop {
        background-color: var(--background-color-overlay);
      }
      .content {
        padding: calc(var(--spacing) * 5) calc(var(--spacing) * 5) calc(var(--spacing) * 8);
      }
      .handle {
        width: calc(var(--spacing) * 9);
        margin: 0 auto calc(var(--spacing) * 2);
        border-top: calc(var(--spacing) * 1) solid var(--border-color-default);
        border-radius: var(--radius-pill);
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: calc(var(--spacing) * 3);
        margin-bottom: calc(var(--spacing) * 3);
      }
      h2 {
        margin: 0;
        font-size: var(--text-h3);
        line-height: var(--text-h3--line-height);
        font-weight: var(--text-h3--font-weight);
        letter-spacing: var(--text-h3--letter-spacing);
      }
      .close {
        display: grid;
        width: calc(var(--spacing) * 11);
        height: calc(var(--spacing) * 11);
        flex-shrink: 0;
        place-items: center;
        border: 0;
        border-radius: var(--radius-pill);
        background: transparent;
        color: var(--text-color-tertiary);
        cursor: pointer;
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .close:active {
        transform: scale(0.95);
      }
      .close svg {
        width: calc(var(--spacing) * 6);
        height: calc(var(--spacing) * 6);
      }
    `,
  ]

  render() {
    return html`
      <dialog aria-labelledby="title" @close=${this.#onNativeClose} @click=${this.#onClick}>
        <div class="content">
          <div class="handle" aria-hidden="true"></div>
          <header>
            <h2 id="title">${this.title}</h2>
            <button class="close" type="button" aria-label="Cerrar" @click=${this.#requestClose}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <slot></slot>
        </div>
      </dialog>
    `
  }

  updated(changed: PropertyValues<this>) {
    if (!changed.has('open')) return
    if (this.open && !this.dialog.open) this.dialog.showModal()
    if (!this.open && this.dialog.open) this.dialog.close()
  }

  #requestClose() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  /** Escape cierra el `<dialog>` sin preguntar: se avisa solo si seguía abierta para quien la usa. */
  #onNativeClose() {
    if (this.open) this.#requestClose()
  }

  /** Un toque en el velo llega al propio `<dialog>`, no a su contenido. */
  #onClick(event: MouseEvent) {
    if (event.target === this.dialog) this.#requestClose()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-sheet': RoburSheet
  }
}
