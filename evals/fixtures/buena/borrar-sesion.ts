import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import 'robur-ds';

@customElement('robur-delete-session-sheet')
export class RoburDeleteSessionSheet extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) loading = false;
  @property({ attribute: 'session-name' }) sessionName = '';

  private _confirm(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
  }

  private _cancel(e: Event) {
    e.stopPropagation();
    this.open = false;
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  render() {
    const description = this.sessionName
      ? `Se perderá la sesión «${this.sessionName}» con todos sus ejercicios y cifras.`
      : 'Se perderá la sesión con todos sus ejercicios y cifras.';

    return html`
      <robur-confirm-sheet
        ?open=${this.open}
        ?loading=${this.loading}
        title="¿Borrar esta sesión?"
        description=${description}
        confirm-label="Borrar sesión"
        @confirm=${this._confirm}
        @cancel=${this._cancel}
      ></robur-confirm-sheet>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-delete-session-sheet': RoburDeleteSessionSheet;
  }
}
