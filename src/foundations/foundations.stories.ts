import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cssVar, primitiveTokens, primitiveVar, semanticTokens, textStyles } from './tokens'

const meta: Meta = {
  title: 'Fundamentos/Tokens',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

// Estas páginas no son componentes: pintan los tokens con su propio CSS, también con var().
const styles = html`<style>
  .ds-f { display: flex; flex-direction: column; gap: calc(var(--spacing) * 8); margin: 0; padding: 0; list-style: none; }
  .ds-f ul { display: flex; flex-direction: column; gap: calc(var(--spacing) * 2); margin: 0; padding: 0; list-style: none; }
  .ds-f li { display: flex; align-items: center; gap: calc(var(--spacing) * 3); }
  .ds-f h2 { margin: 0 0 calc(var(--spacing) * 3); font-size: var(--text-h3); line-height: var(--text-h3--line-height); font-weight: var(--text-h3--font-weight); }
  .ds-f p { margin: 0; font-size: var(--text-sm); line-height: var(--text-sm--line-height); }
  .ds-f .name { font-weight: var(--text-control--font-weight); }
  .ds-f .meta { color: var(--text-color-tertiary); }
  .ds-f .swatch { display: inline-block; width: calc(var(--spacing) * 10); height: calc(var(--spacing) * 10); flex-shrink: 0; border: 1px solid var(--border-color-default); border-radius: var(--radius-sm); }
  .ds-f.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: calc(var(--spacing) * 3); }
  .ds-f.row { flex-direction: row; flex-wrap: wrap; gap: calc(var(--spacing) * 6); }
  .ds-f.row li { flex-direction: column; gap: calc(var(--spacing) * 2); }
  .ds-f .box { display: block; width: calc(var(--spacing) * 20); height: calc(var(--spacing) * 20); border: 1px solid var(--border-color-control); background: var(--background-color-surface); }
  .ds-f.type li { display: block; }
</style>`

const GROUPS = { text: 'Texto', bg: 'Fondos', border: 'Bordes', focus: 'Foco', heat: 'Heatmap', data: 'Datos' }

/** Los tokens que usan los componentes. Cambia el tema en la barra superior para ver sus valores en oscuro. */
export const ColoresSemanticos: Story = {
  render: () => html`${styles}
    <div class="ds-f">
      ${Object.entries(GROUPS).map(
        ([group, title]) => html`
          <section>
            <h2>${title}</h2>
            <ul>
              ${semanticTokens
                .filter((token) => token.name.startsWith(`color.${group}.`))
                .map(
                  (token) => html`
                    <li>
                      <span class="swatch" style=${styleMap({ background: cssVar(token.name) })}></span>
                      <div>
                        <p class="name">${token.name}</p>
                        <p class="meta">${token.description ? token.description + ' ' : ''}Claro: ${token.light} · Oscuro: ${token.dark}</p>
                      </div>
                    </li>
                  `,
                )}
            </ul>
          </section>
        `,
      )}
    </div>`,
}

/** La paleta en bruto. Los componentes no la usan: solo sirve para dar valor a los semánticos. */
export const ColoresPrimitivos: Story = {
  render: () => html`${styles}
    <ul class="ds-f grid">
      ${primitiveTokens
        .filter((token) => token.name.startsWith('color.'))
        .map(
          (token) => html`
            <li>
              <span class="swatch" style=${styleMap({ background: primitiveVar(token.name) })}></span>
              <div>
                <p class="name">${token.name.replace('color.', '')}</p>
                <p class="meta">${String(token.value)}</p>
              </div>
            </li>
          `,
        )}
    </ul>`,
}

export const Tipografia: Story = {
  render: () => html`${styles}
    <ul class="ds-f type">
      ${textStyles.map((token) => {
        const name = token.name.replace('text.', '')
        const value = token.value as { fontSize: string; fontWeight: number; lineHeight: number }
        const style = {
          fontSize: `var(--text-${name})`,
          fontWeight: `var(--text-${name}--font-weight)`,
          lineHeight: `var(--text-${name}--line-height)`,
          letterSpacing: `var(--text-${name}--letter-spacing)`,
        }
        return html`
          <li>
            <p style=${styleMap(style)}>Tres sesiones esta semana</p>
            <p class="meta">--text-${name} · ${value.fontSize} · peso ${value.fontWeight} · interlineado ${value.lineHeight}</p>
          </li>
        `
      })}
    </ul>`,
}

export const RadiosYSombras: Story = {
  render: () => html`${styles}
    <ul class="ds-f row">
      ${primitiveTokens
        .filter((token) => /^(radius|shadow)\./.test(token.name))
        .map((token) => {
          const name = token.name.replace('.', '-')
          const isRadius = token.name.startsWith('radius.')
          const style = isRadius ? { borderRadius: `var(--${name})` } : { boxShadow: `var(--${name})`, borderRadius: 'var(--radius-md)' }
          return html`
            <li>
              <span class="box" style=${styleMap(style)}></span>
              <p class="name">--${name}</p>
              <p class="meta">${isRadius ? String(token.value) : ''}</p>
            </li>
          `
        })}
    </ul>`,
}
