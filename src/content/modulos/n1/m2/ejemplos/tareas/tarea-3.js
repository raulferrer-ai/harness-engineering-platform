// tareas/tarea-3.js — entrega de referencia de la tarea 3 de serie.js
// Debe satisfacer los 3 criterios de tarea-3; las pruebas están en tarea-3.test.js.

/** Devuelve `a + b` en céntimos enteros y luego dividida entre 100 (sin error binario). */
export function sumaDecimales(a, b) {
  const centimosA = Math.round(a * 100);
  const centimosB = Math.round(b * 100);
  return (centimosA + centimosB) / 100;
}
