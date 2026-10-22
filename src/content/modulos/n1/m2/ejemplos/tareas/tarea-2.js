// tareas/tarea-2.js — entrega de referencia de la tarea 2 de serie.js
// Debe satisfacer los 4 criterios de tarea-2; las pruebas están en tarea-2.test.js.

/** Devuelve el número de líneas de `texto` (\n o \r\n), sin contar la línea vacía final. */
export function contarLineas(texto) {
  if (texto === "") return 0;
  const lineas = texto.split(/\r\n|\n/);
  if (lineas[lineas.length - 1] === "") lineas.pop();
  return lineas.length;
}
