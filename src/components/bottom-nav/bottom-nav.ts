import { LitElement, css, html, nothing, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'

/** Una sección de la navegación. El icono es una plantilla de Lit que pinta un SVG. */
export interface NavItem {
  value: string
  label: string
  href: string
  icon: TemplateResult
}

/**
 * La navegación principal de la app, fija abajo.
 *
 * @summary Navegación inferior.
 */
@customElement('robur-bottom-nav')
export class RoburBottomNav extends LitElement {
  /** Nombre de la navegación para lectores de pantalla. */
  @property() label = 'Principal'
  /** Las secciones, en orden. Máximo cinco. */
  @property({ attribute: false }) items!: NavItem[]
  /** Valor de la sección en la que está la persona. */
  @property() value!: string

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      nav {
        display: flex;
        justify-content: space-between;
        padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
        background-color: var(--background-color-surface);
        box-shadow: var(--shadow-sm);
      }
      a {
        display: flex;
        min-width: calc(var(--spacing) * 11);
        min-height: calc(var(--spacing) * 11);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: calc(var(--spacing) * 1);
        border-radius: var(--radius-md);
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 3);
        color: var(--text-color-tertiary);
        text-decoration: none;
        font-size: var(--text-label);
        line-height: var(--text-label--line-height);
        font-weight: var(--text-label--font-weight);
        letter-spacing: var(--text-label--letter-spacing);
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      a:active {
        transform: scale(0.95);
      }
      [aria-current='page'] {
        background-color: var(--background-color-page);
        color: var(--text-color-primary);
      }
      .icon,
      .icon svg {
        display: block;
        width: calc(var(--spacing) * 6);
        height: calc(var(--spacing) * 6);
      }
    `,
  ]

  render() {
    return html`
      <nav aria-label=${this.label}>
        ${(this.items ?? []).map(
          (item) => html`
            <a href=${item.href} aria-current=${item.value === this.value ? 'page' : nothing}>
              <span class="icon" aria-hidden="true">${item.icon}</span>
              ${item.label}
            </a>
          `,
        )}
      </nav>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-bottom-nav': RoburBottomNav
  }
}
