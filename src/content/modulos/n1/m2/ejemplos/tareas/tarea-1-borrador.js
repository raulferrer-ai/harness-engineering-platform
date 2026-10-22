// tareas/tarea-1-borrador.js — borrador plausible del asistente para la tarea 1
// Recorta y separa palabras, pero NO colapsa espacios dobles ni pone
// mayúsculas: pasa 2 de 4 criterios. Es el rojo deliberado de criterios-primero.js:
// plausible, bien formado… y refutado por los criterios al ejecutarlo.

/** Devuelve `texto` recortado con espacios simples (parcialmente incompleto). */
export function normalizarNombre(texto) {
  return texto.trim().replace(/\s+/g, " ");
}
