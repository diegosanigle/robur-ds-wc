// Custom Elements Manifest: describe cada etiqueta <robur-*> (props, atributos, eventos, slots)
// leyendo el código. Lo usan Storybook y, desde el bloque 2, la comprobación de contratos.
export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.stories.ts', 'src/**/*.test.ts'],
  outdir: '.',
  litelement: true,
}
