import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-sin-sesiones')
export class SinSesiones extends LitElement {
  static styles = css`
    .empty { display: flex; flex-direction: column; align-items: center; padding: 32px; border-radius: 16px; background: #f9fafb; text-align: center; }
    h2 { margin-top: 16px; font-size: 18px; color: #111827; }
    p { color: gray; }
    button { margin-top: 24px; border-radius: 999px; padding: 12px 24px; background: var(--orange-500); color: white; }
  `

  render() {
    return html`
      <div class="empty">
        <span>😴</span>
        <h2>¡Todavía no has entrenado esta semana!</h2>
        <p>Te faltan 3 sesiones para cumplir tu objetivo.</p>
        <button @click=${() => this.dispatchEvent(new CustomEvent('add'))}>Empezar ahora</button>
      </div>
    `
  }
}
