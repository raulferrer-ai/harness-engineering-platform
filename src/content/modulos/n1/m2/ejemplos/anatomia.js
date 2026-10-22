// anatomia.js — la anatomía de una tarea pequeña: instrucción, entregable, criterios (l01)
//
// Una tarea pequeña tiene tres piezas:
//   1. una instrucción concreta (qué hacer, con nombres reales);
//   2. UN entregable nombrable (qué se recibe al terminar);
//   3. criterios observables (cómo se ve que está terminada).
// Este script comprueba esa anatomía en tres tareas de ejemplo y la muestra.
// Regla del curso: la instrucción tiene al menos 40 caracteres — «arregla el
// login» (16) no dice nada verificable; una instrucción con nombres y resultado sí.
//
// Uso: node anatomia.js

/**
 * Comprueba la anatomía de una tarea pequeña.
 * @param {{ instruccion: string, entregable: string, criterios: string[] }} tarea
 * @returns {string[]} incidencias vacías si la anatomía es correcta
 */
export function revisarAnatomia(tarea) {
  const incidencias = [];
  const instruccion =
    typeof tarea.instruccion === "string" ? tarea.instruccion.trim() : "";
  if (instruccion.length < 40) {
    incidencias.push(
      `instrucción vaga (${instruccion.length} caracteres; el curso exige 40)`,
    );
  }
  const entregable =
    typeof tarea.entregable === "string" ? tarea.entregable.trim() : "";
  if (entregable.length === 0) {
    incidencias.push("sin entregable nombrable: no se sabe qué se recibe");
  }
  const criterios = Array.isArray(tarea.criterios) ? tarea.criterios : [];
  if (criterios.length === 0) {
    incidencias.push("sin criterios: no hay forma de comprobar que acabó");
  } else if (criterios.length > 5) {
    incidencias.push(`${criterios.length} criterios; el curso admite 5 como máximo`);
  }
  return incidencias;
}

const tareas = [
  {
    id: "tarea-1",
    instruccion:
      "Escribe una función normalizarNombre(texto) que devuelve el texto con un solo espacio entre palabras y la primera letra de cada palabra en mayúscula.",
    entregable: "un archivo normalizar-nombre.js que exporta normalizarNombre",
    criterios: [
      "«Ana   maría» → «Ana María»",
      "«  luis  » → «Luis»",
      "una cadena vacía devuelve una cadena vacía",
    ],
  },
  {
    id: "tarea-2",
    instruccion:
      "Escribe una función contarLineas(texto) que devuelve el número de líneas, aceptando saltos \\n y \\r\\n y sin contar la línea vacía final.",
    entregable: "un archivo contar-lineas.js que exporta contarLineas",
    criterios: [
      "«a\\nb\\nc» → 3",
      "«a\\r\\nb» → 2",
      "«» → 0",
    ],
  },
  {
    id: "tarea-3",
    instruccion:
      "Escribe una función sumaDecimales(a, b) que devuelve a + b redondeada a 2 decimales sin error binario en los casos de prueba indicados.",
    entregable: "un archivo suma-decimales.js que exporta sumaDecimales",
    criterios: [
      "sumaDecimales(0.1, 0.2) → 0.3 exactamente",
      "sumaDecimales(1.1, 2.2) → 3.3 exactamente",
      "sumaDecimales(-0.15, 0.05) → -0.1 exactamente",
    ],
  },
];

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("anatomia.js")) {
  let validas = 0;
  for (const tarea of tareas) {
    const incidencias = revisarAnatomia(tarea);
    if (incidencias.length === 0) {
      validas += 1;
      console.log(
        `✓ ${tarea.id}: instrucción (${tarea.instruccion.length} caracteres), ` +
          `1 entregable, ${tarea.criterios.length} criterios`,
      );
    } else {
      for (const incidencia of incidencias) console.log(`✗ ${tarea.id}: ${incidencia}`);
    }
  }
  console.log(`anatomía correcta: ${validas} de ${tareas.length} tareas`);
  if (validas !== tareas.length) process.exit(1);
}
