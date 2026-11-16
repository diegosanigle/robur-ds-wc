import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import { watchListeners } from '../../utils/listeners'
import '../icon'

/**
 * Una fila de una lista: título, detalle, una cifra opcional y sus acciones.
 *
 * Va dentro de un `<ul>`: la etiqueta hace de elemento de lista (`role="listitem"`).
 *
 * @summary Fila de lista del sistema.
 * @fires select - Al pulsar la fila. Si alguien lo escucha, la fila se puede pulsar; sin acciones, lleva una flecha.
 * @slot - Opcional. Acciones de la fila, al final: botones `text` («Editar», «Quitar»).
 */
@customElement('robur-list-row')
export class RoburListRow extends LitElement {
  /** Lo que nombra la fila: un ejercicio, una sesión, un día tipo. */
  @property() title!: string
  /** Una línea de detalle bajo el título: fecha, series, grupo muscular. */
  @property() detail?: string
  /** Una cifra a la derecha, ya formateada. */
  @property() value?: string

  /** @internal Hay acciones en el slot. */
  @state() private hasActions = false
  /** @internal Alguien escucha `select`. */
  #selectable = watchListeners(this, 'select', () => this.requestUpdate())

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem')
  }

  static styles = [
    base,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 3);
        border-bottom: 1px solid var(--border-color-default);
      }
      :host(:last-child) {
        border-bottom: 0;
      }
      .main {
        display: flex;
        min-height: calc(var(--spacing) * 11);
        flex: 1;
        align-items: center;
        gap: calc(var(--spacing) * 3);
        padding: calc(var(--spacing) * 3.5) 0;
      }
      button.main {
        margin: 0;
        border: 0;
        background: none;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      button.main:active {
        transform: scale(0.99);
      }
      .text {
        display: flex;
        min-width: 0;
        flex: 1;
        flex-direction: column;
      }
      .title,
      .value {
        color: var(--text-color-primary);
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
        letter-spacing: var(--text-title--letter-spacing);
      }
      .detail {
        color: var(--text-color-tertiary);
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
      }
      .detail,
      .value {
        font-variant-numeric: tabular-nums;
      }
      robur-icon {
        color: var(--text-color-tertiary);
      }
      .actions {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        gap: calc(var(--spacing) * 1);
      }
      .actions:not(.filled) {
        display: none;
      }
    `,
  ]

  render() {
    const content = html`
      <span class="text">
        <span class="title">${this.title}</span>
        ${this.detail ? html`<span class="detail">${this.detail}</span>` : nothing}
      </span>
      ${this.value ? html`<span class="value">${this.value}</span>` : nothing}
    `
    return html`
      ${this.#selectable()
        ? html`<button type="button" class="main" @click=${this.#select}>
            ${content}${this.hasActions ? nothing : html`<robur-icon name="chevron-right"></robur-icon>`}
          </button>`
        : html`<div class="main">${content}</div>`}
      <div class=${this.hasActions ? 'actions filled' : 'actions'}><slot @slotchange=${this.#onSlotChange}></slot></div>
    `
  }

  #onSlotChange(event: Event) {
    this.hasActions = (event.target as HTMLSlotElement).assignedElements().length > 0
  }

  #select() {
    this.dispatchEvent(new CustomEvent('select', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-list-row': RoburListRow
  }
}
