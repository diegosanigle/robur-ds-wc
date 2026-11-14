import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/** Una pestaña: su valor y su texto visible. */
export interface Tab {
  value: string
  label: string
}

/**
 * Cambia entre vistas de un mismo contenido.
 *
 * @summary Pestañas del sistema.
 * @fires change - Al elegir una pestaña. `event.detail` es su valor.
 * @slot - Opcional: el contenido de la pestaña activa.
 */
@customElement('robur-tabs')
export class RoburTabs extends LitElement {
  /** Nombre del grupo de pestañas para lectores de pantalla. */
  @property() label!: string
  /** Las pestañas, en orden. Entre dos y cuatro. */
  @property({ attribute: false }) tabs!: Tab[]
  /** Valor de la pestaña activa. */
  @property() value!: string

  /** @internal Hay contenido dentro: si no, no se pinta el panel. */
  @state() private hasPanel = false

  static styles = [
    base,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 4);
      }
      [role='tablist'] {
        display: flex;
        gap: calc(var(--spacing) * 1);
        border-radius: var(--radius-pill);
        padding: calc(var(--spacing) * 1);
        background-color: var(--background-color-surface);
      }
      [role='tab'] {
        min-height: calc(var(--spacing) * 11);
        flex: 1;
        border: 0;
        border-radius: var(--radius-pill);
        padding: 0 calc(var(--spacing) * 4);
        background: transparent;
        color: var(--text-color-tertiary);
        font-family: inherit;
        font-size: var(--text-control);
        line-height: var(--text-control--line-height);
        font-weight: var(--text-control--font-weight);
        letter-spacing: var(--text-control--letter-spacing);
        cursor: pointer;
        transition-property: color, background-color, transform;
        transition-duration: 150ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      [role='tab']:active {
        transform: scale(0.95);
      }
      [aria-selected='true'] {
        background-color: var(--background-color-selected);
        color: var(--text-color-on-selected);
      }
      [role='tabpanel'][hidden] {
        display: none;
      }
    `,
  ]

  render() {
    const tabs = this.tabs ?? []
    return html`
      <div role="tablist" aria-label=${this.label} @keydown=${this.#onKeyDown}>
        ${tabs.map((tab) => {
          const active = tab.value === this.value
          return html`
            <button
              type="button"
              role="tab"
              id=${`tab-${tab.value}`}
              aria-selected=${active ? 'true' : 'false'}
              aria-controls=${active && this.hasPanel ? 'panel' : nothing}
              tabindex=${active ? 0 : -1}
              @click=${() => this.#choose(tab.value)}
            >
              ${tab.label}
            </button>
          `
        })}
      </div>
      <div role="tabpanel" id="panel" aria-labelledby=${`tab-${this.value}`} tabindex="0" ?hidden=${!this.hasPanel} @change=${this.#stopNativeChange}>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `
  }

  #choose(value: string) {
    this.dispatchEvent(new CustomEvent('change', { detail: value, bubbles: true, composed: true }))
  }

  /** Patrón de pestañas de WAI-ARIA: las flechas mueven el foco y la selección a la vez. */
  #onKeyDown(event: KeyboardEvent) {
    const tabs = this.tabs ?? []
    const index = tabs.findIndex((tab) => tab.value === this.value)
    const next = ({
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    } as Record<string, number>)[event.key]
    if (next === undefined) return
    event.preventDefault()
    this.#choose(tabs[next].value)
    this.renderRoot.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }

  /**
   * Un `change` nativo del contenido (una casilla dentro del panel) subiría hasta la etiqueta
   * y se confundiría con el de las pestañas. Se detiene en el panel.
   */
  #stopNativeChange(event: Event) {
    event.stopPropagation()
  }

  #onSlotChange(event: Event) {
    this.hasPanel = (event.target as HTMLSlotElement).assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim())
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-tabs': RoburTabs
  }
}
