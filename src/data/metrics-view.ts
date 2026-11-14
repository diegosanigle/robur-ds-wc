import { LitElement, css, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import history from '../../metrics/history.json'
import metrics from '../../metrics/latest.json'
import { base } from '../styles/shared'
import '../components/card'
import '../components/stat-card'

type App = null | { files: number; filesUsingSystem: number; rawControls: number; classesOutsideSystem: number; hexColors: number; arbitraryValues: number }
type Row = { date: string; components: number; stories: number; figmaParity: number; evalsWithMcp: number | null; appRawControls: number | null }

const number = (value: number | null | undefined) => (value === null || value === undefined ? '—' : value.toLocaleString('es-ES'))

/**
 * La última medición del sistema, pintada con sus propios componentes. Ningún número se escribe a mano.
 *
 * @summary Página de métricas.
 */
@customElement('robur-metrics-view')
export class RoburMetricsView extends LitElement {
  static styles = [
    base,
    css`
      :host {
        display: flex;
        max-width: calc(var(--spacing) * 240);
        flex-direction: column;
        gap: calc(var(--spacing) * 8);
        color: var(--text-color-primary);
      }
      section {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 4);
      }
      h2 {
        margin: 0;
        font-size: var(--text-h3);
        line-height: var(--text-h3--line-height);
        font-weight: var(--text-h3--font-weight);
        letter-spacing: var(--text-h3--letter-spacing);
      }
      p {
        margin: 0;
      }
      .date,
      .note {
        color: var(--text-color-tertiary);
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: calc(var(--spacing) * 4);
      }
      @media (min-width: 48rem) {
        .grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
      .wide {
        grid-column: span 2;
      }
      .title {
        font-size: var(--text-title);
        line-height: var(--text-title--line-height);
        font-weight: var(--text-title--font-weight);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
      }
      th {
        padding-bottom: calc(var(--spacing) * 2);
        color: var(--text-color-tertiary);
        font-weight: var(--text-control--font-weight);
      }
      td {
        padding: calc(var(--spacing) * 1) 0;
        font-variant-numeric: tabular-nums;
      }
    `,
  ]

  render() {
    const evals = metrics.evals
      ? Object.entries(metrics.evals as Record<string, unknown>)
          .filter(([, value]) => typeof value === 'object')
          .map(([name, value]) => ({ name, rate: (value as { rate: number }).rate }))
      : null
    const app = metrics.app as App
    return html`
      <p class="date">Medición del ${metrics.date}</p>
      <section>
        <h2>Tamaño del sistema</h2>
        <div class="grid">
          <robur-stat-card variant="inverse" label="Componentes" value=${number(metrics.system.components)}></robur-stat-card>
          <robur-stat-card label="Patrones" value=${number(metrics.system.patterns)}></robur-stat-card>
          <robur-stat-card label="Tokens semánticos" value=${number(metrics.system.semanticTokens)}></robur-stat-card>
          <robur-stat-card label="Stories con test" value=${number(metrics.system.stories)}></robur-stat-card>
        </div>
      </section>
      <section>
        <h2>Coherencia</h2>
        <div class="grid">
          <robur-stat-card label="Piezas con contrato" value=${number(metrics.coverage.contracts)} unit="%"></robur-stat-card>
          <robur-stat-card label="Props documentadas" value=${number(metrics.coverage.documentedProps)} unit="%"></robur-stat-card>
          <robur-stat-card label="Paridad con Figma" value=${number(metrics.coverage.figmaParity)} unit="%"></robur-stat-card>
          <robur-stat-card label="Antigüedad de la foto de Figma" value=${number(metrics.coverage.figmaSnapshotAgeDays)} unit="días"></robur-stat-card>
        </div>
      </section>
      <section>
        <h2>Accesibilidad</h2>
        <div class="grid">
          <robur-stat-card label="Parejas de contraste comprobadas" value=${number(metrics.accessibility.contrastPairs)}></robur-stat-card>
          <robur-stat-card label="Margen de la pareja más justa" value=${number(metrics.accessibility.tightestPair.margin)} unit="×"></robur-stat-card>
        </div>
      </section>
      <section>
        <h2>Evals: ¿usa bien el agente el sistema?</h2>
        <div class="grid">
          ${evals
            ? evals.map((e) => html`<robur-stat-card label=${e.name} value=${number(e.rate)} unit="%"></robur-stat-card>`)
            : html`<div class="wide">
                <robur-card>
                  <p class="title">Aún no se han ejecutado</p>
                  <p class="note">Se ejecutan con npm run evals y aparecen aquí en la siguiente medición.</p>
                </robur-card>
              </div>`}
        </div>
      </section>
      ${app
        ? html`<section>
            <h2>La app: interfaz que sigue fuera del sistema</h2>
            <div class="grid">
              <robur-stat-card label="Ficheros que usan el sistema" value=${`${number(app.filesUsingSystem)} de ${number(app.files)}`}></robur-stat-card>
              <robur-stat-card label="Controles dibujados a mano" value=${number(app.rawControls)}></robur-stat-card>
              <robur-stat-card label="Clases y variables fuera del sistema" value=${number(app.classesOutsideSystem)}></robur-stat-card>
              <robur-stat-card label="Colores y valores a mano" value=${number(app.hexColors + app.arbitraryValues)}></robur-stat-card>
            </div>
          </section>`
        : nothing}
      <section>
        <h2>Historial</h2>
        <robur-card>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Componentes</th>
                <th>Stories</th>
                <th>Paridad</th>
                <th>Evals con MCP</th>
                <th>Controles a mano en la app</th>
              </tr>
            </thead>
            <tbody>
              ${(history as Row[]).map(
                (row) => html`
                  <tr>
                    <td>${row.date}</td>
                    <td>${number(row.components)}</td>
                    <td>${number(row.stories)}</td>
                    <td>${number(row.figmaParity)} %</td>
                    <td>${row.evalsWithMcp === null ? '—' : `${row.evalsWithMcp} %`}</td>
                    <td>${number(row.appRawControls)}</td>
                  </tr>
                `,
              )}
            </tbody>
          </table>
        </robur-card>
      </section>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robur-metrics-view': RoburMetricsView
  }
}
