import { html } from 'lit'
import '../index'

// Una muestra con todos los componentes, para verlos juntos en los dos temas.
// Es una plantilla, no un componente: la página pinta HTML normal con las etiquetas del sistema.
const TABS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
]

const style = html`<style>
  .ds-sampler { display: flex; flex-direction: column; gap: calc(var(--spacing) * 4); padding: calc(var(--spacing) * 5); background: var(--background-color-page); color: var(--text-color-primary); }
  .ds-sampler h2 { margin: 0; font-size: var(--text-h2); line-height: var(--text-h2--line-height); font-weight: var(--text-h2--font-weight); letter-spacing: var(--text-h2--letter-spacing); }
  .ds-sampler p { margin: 0; }
  .ds-sampler .title { font-size: var(--text-title); line-height: var(--text-title--line-height); font-weight: var(--text-title--font-weight); letter-spacing: var(--text-title--letter-spacing); }
  .ds-sampler .muted { font-size: var(--text-sm); line-height: var(--text-sm--line-height); color: var(--text-color-tertiary); }
  .ds-sampler .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--spacing) * 4); }
  .ds-sampler .heat { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: calc(var(--spacing) * 1); }
  .ds-sampler .row { display: flex; flex-wrap: wrap; gap: calc(var(--spacing) * 2); }
</style>`

export const sampler = () => html`
  ${style}
  <div class="ds-sampler">
    <h2>Tu semana</h2>
    <robur-tabs label="Periodo" value="semana" .tabs=${TABS}></robur-tabs>
    <div class="two">
      <robur-stat-card label="Sesiones" value="3"></robur-stat-card>
      <robur-stat-card variant="inverse" label="Volumen" value="2.480" unit="kg"></robur-stat-card>
      <robur-stat-card variant="inverse" series="secondary" label="Peso máximo" value="62,5" unit="kg"></robur-stat-card>
      <robur-card>
        <p class="title">Descanso</p>
        <p class="muted">Sin sesiones previstas.</p>
      </robur-card>
    </div>
    <div class="heat">
      ${[0, 1, 2, 3, 4].map((sessions) => html`<robur-heatmap-cell week=${10 + sessions} sessions=${sessions}></robur-heatmap-cell>`)}
      <robur-heatmap-cell week="15" sessions="0" rest></robur-heatmap-cell>
      <robur-heatmap-cell week="16" sessions="2" current></robur-heatmap-cell>
    </div>
    <div class="row">
      <robur-chip selected>Empuje</robur-chip>
      <robur-chip>Tirón</robur-chip>
      <robur-chip variant="accent">Nuevo</robur-chip>
    </div>
    <robur-exercise-row name="Press de hombro" target="3 series × 12 reps" completed>
      <robur-input numeric label="Series" value="3"></robur-input>
      <robur-input numeric label="Reps" value="12"></robur-input>
      <robur-input numeric label="Peso (kg)" value="20"></robur-input>
    </robur-exercise-row>
    <robur-checkbox label="Plancha" hint="60 s"></robur-checkbox>
    <robur-input label="Notas" hint="Opcional." placeholder="Cómo te has sentido"></robur-input>
    <robur-input label="Nombre" error="Escribe un nombre para el ejercicio."></robur-input>
    <div class="row">
      <robur-button>Guardar sesión</robur-button>
      <robur-button variant="secondary">Cancelar</robur-button>
      <robur-button variant="danger">Borrar sesión</robur-button>
    </div>
  </div>
`
