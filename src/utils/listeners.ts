/**
 * Un Web Component no puede preguntar si alguien escucha uno de sus eventos. Algunas piezas
 * cambian de aspecto según eso (ListRow es pulsable si se escucha `select`; ScreenState ofrece
 * Reintentar si se escucha `retry`), así que apuntan quién se suscribe a ese evento.
 * Devuelve una función que dice si ahora mismo hay alguien escuchando.
 */
export function watchListeners(element: EventTarget, type: string, onChange: () => void) {
  let count = 0
  const add = element.addEventListener.bind(element)
  const remove = element.removeEventListener.bind(element)
  element.addEventListener = (...args: Parameters<EventTarget['addEventListener']>) => {
    if (args[0] === type && args[1]) {
      count++
      onChange()
    }
    add(...args)
  }
  element.removeEventListener = (...args: Parameters<EventTarget['removeEventListener']>) => {
    if (args[0] === type && args[1]) {
      count = Math.max(0, count - 1)
      onChange()
    }
    remove(...args)
  }
  return () => count > 0
}
