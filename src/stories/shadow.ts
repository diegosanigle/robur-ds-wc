import { within } from 'storybook/test'

/**
 * Las herramientas de test buscan en la página, y el Shadow DOM queda fuera de su vista.
 * `inside(raíz, 'robur-exercise-row', 'robur-checkbox')` entra por cada etiqueta de la ruta y
 * devuelve las consultas de siempre (getByRole, getByLabelText…) dentro de la última.
 */
export function inside(root: Element | ShadowRoot, ...tags: string[]) {
  let node: Element | ShadowRoot = root
  for (const tag of tags) {
    const element: Element | null = node.querySelector(tag)
    if (!element?.shadowRoot) throw new Error(`No encuentro <${tag}> con Shadow DOM`)
    node = element.shadowRoot
  }
  return within(node as unknown as HTMLElement)
}

/** Las consultas dentro del Shadow DOM de un elemento concreto. */
export const shadowOf = (element: Element) => inside(element.shadowRoot!)
