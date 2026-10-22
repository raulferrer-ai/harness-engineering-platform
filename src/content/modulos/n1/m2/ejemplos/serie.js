// serie.js — la serie de tareas de 10 minutos con pruebas: el entregable del módulo (l06)
//
// Tres tareas pequeñas, cada una con su anatomía completa (l01), contexto
// mínimo (l02), criterios ejecutables (l03), archivos permitidos (l04) y un
// comando de verificación de menos de 10 minutos (l05). Las implementaciones
// de referencia y sus pruebas viven en tareas/ y se ejecutan con node --test.
//
// Uso: node serie.js

import { basename } from "node:path";

/** @type {{ id: string, titulo: string, instruccion: string, entregable: string, contexto: string[], criterios: string[], archivosPermitidos: string[], verificacion: string }[]} */
export const serie = [
  {
    id: "tarea-1",
    titulo: "Normalizar nombres propios",
    instruccion:
      "Escribe tareas/tarea-1.js con una función normalizarNombre(texto) que devuelve el texto recortado, con un solo espacio entre palabras y la primera letra de cada palabra en mayúscula.",
    entregable: "un único archivo tareas/tarea-1.js que exporta normalizarNombre",
    contexto: [
      "fragmento actual: export function normalizarNombre(texto) { return texto.trim(); }",
      "convención: módulos ESM, funciones puras, identificadores en español",
      "verificación: node --test tareas/tarea-1.test.js",
    ],
    criterios: [
      "«Ana   maría» → «Ana María» (espacios dobles colapsados)",
      "«  luis  » → «Luis» (extremos recortados y mayúscula inicial)",
      "«cARLOS lÓPEZ» → «Carlos López» (resto en minúsculas)",
      "«» → «» (cadena vacía sin excepciones)",
    ],
    archivosPermitidos: ["tareas/tarea-1.js"],
    verificacion: "node --test tareas/tarea-1.test.js",
  },
  {
    id: "tarea-2",
    titulo: "Contar líneas de texto",
    instruccion:
      "Escribe tareas/tarea-2.js con una función contarLineas(texto) que devuelve el número de líneas, aceptando \\n y \\r\\n y sin contar la línea vacía final.",
    entregable: "un único archivo tareas/tarea-2.js que exporta contarLineas",
    contexto: [
      "frontera: «» → 0 y «a\\n» → 1 (la línea vacía final no cuenta)",
      "convención: módulos ESM y funciones puras",
      "verificación: node --test tareas/tarea-2.test.js",
    ],
    criterios: [
      "«a\\nb\\nc» → 3",
      "«a\\r\\nb» → 2 (saltos Windows también)",
      "«» → 0",
      "«uno\\ndos\\n» → 2 (sin línea vacía final)",
    ],
    archivosPermitidos: ["tareas/tarea-2.js"],
    verificacion: "node --test tareas/tarea-2.test.js",
  },
  {
    id: "tarea-3",
    titulo: "Suma con dos decimales exactos",
    instruccion:
      "Escribe tareas/tarea-3.js con una función sumaDecimales(a, b) que devuelve a + b en céntimos enteros y luego dividida entre 100, sin error binario acumulado.",
    entregable: "un único archivo tareas/tarea-3.js que exporta sumaDecimales",
    contexto: [
      "frontera: 0.1 + 0.2 debe ser 0.3 exactamente, no 0.30000000000000004",
      "convención: módulos ESM y funciones puras",
      "verificación: node --test tareas/tarea-3.test.js",
    ],
    criterios: [
      "sumaDecimales(0.1, 0.2) → 0.3 exactamente",
      "sumaDecimales(1.1, 2.2) → 3.3 exactamente",
      "sumaDecimales(-0.15, 0.05) → -0.1 exactamente",
    ],
    archivosPermitidos: ["tareas/tarea-3.js"],
    verificacion: "node --test tareas/tarea-3.test.js",
  },
];

// Demostración al ejecutar el fichero directamente (no al importarlo).
// Comparación exacta del nombre: «comprobar-serie.js» también termina en «serie.js».
if (process.argv[1] && basename(process.argv[1]) === "serie.js") {
  const criterios = serie.reduce((total, tarea) => total + tarea.criterios.length, 0);
  console.log(`serie de ${serie.length} tareas · ${criterios} criterios · ${serie.length} comandos de verificación`);
  for (const tarea of serie) {
    console.log(` ${tarea.id} — ${tarea.titulo} (${tarea.criterios.length} criterios)`);
  }
}
