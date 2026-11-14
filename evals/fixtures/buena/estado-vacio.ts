import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import 'robur-ds'

@customElement('app-sin-sesiones')
export class SinSesiones extends LitElement {
  render() {
    return html`
      <robur-empty-state
        title="Aún no hay sesiones esta semana"
        description="Cuando registres una, aparecerá aquí."
        action-label="Registrar sesión"
        @action=${() => this.dispatchEvent(new CustomEvent('add'))}
      ></robur-empty-state>
    `
  }
}
