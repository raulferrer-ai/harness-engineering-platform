// tareas/tarea-1.js — entrega de referencia de la tarea 1 de serie.js
// Debe satisfacer los 4 criterios de tarea-1; las pruebas están en tarea-1.test.js.

/** Devuelve `texto` recortado, con un solo espacio entre palabras y cada palabra con mayúscula inicial. */
export function normalizarNombre(texto) {
  const palabras = texto
    .trim()
    .split(/\s+/)
    .filter((palabra) => palabra.length > 0);
  return palabras
    .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}
