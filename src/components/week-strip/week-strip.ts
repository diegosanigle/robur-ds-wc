import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { base } from '../../styles/shared'
import '../icon'

/**
 * Los siete días de la semana en curso, con una marca en los que tuvieron sesión.
 *
 * @summary Semana en curso.
 */
@customElement('robur-week-strip')
export class RoburWeekStrip extends LitElement {
  /** Los siete días de la semana, de lunes a domingo. */
  @property({ attribute: false }) days!: { label: string; name: string; done?: boolean; current?: boolean }[]

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      ul {
        display: flex;
        justify-content: space-between;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(var(--spacing) * 2);
      }
      .mark {
        display: flex;
        width: calc(var(--spacing) * 9);
        height: calc(var(--spacing) * 9);
        align-items: center;
        justify-content: center;
        border: 2px solid var(--border-color-inverse);
        border-radius: var(--radius-pill);
      }
      .done {
        border: 0;
        background-color: var(--color-data-1);
        color: var(--text-color-on-action);
      }
      .current {
        outline: 2px solid var(--color-data-1);
        outline-offset: 2px;
      }
      .letter {
        color: var(--text-color-on-inverse-muted);
        font-size: var(--text-label);
        line-height: var(--text-label--line-height);
        font-weight: var(--text-label--font-weight);
        letter-spacing: var(--text-label--letter-spacing);
      }
      .letter.today {
        color: var(--text-color-on-inverse);
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    `,
  ]

  render() {
    return html`
      <ul>
        ${(this.days ?? []).map(
          (day) => html`
            <li>
              <span class="sr-only">${day.name}${day.done ? ', con sesión' : ''}${day.current ? ', hoy' : ''}</span>
              <span aria-hidden="true" class=${['mark', day.done ? 'done' : '', day.current ? 'current' : ''].join(' ')}>
                ${day.done ? html`<robur-icon name="check"></robur-icon>` : nothing}
              </span>
              <span aria-hidden="true" class=${day.current ? 'letter today' : 'letter'}>${day.label}</span>
            </li>
          `,
        )}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-week-strip': RoburWeekStrip
  }
}
