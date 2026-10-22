// comprobar-serie.js — el validador de la serie: una tarea, cinco reglas (l06)
//
// Cada tarea de la serie debe cumplir las reglas del módulo:
//   1. anatomía (l01): instrucción ≥ 40 caracteres, UN entregable nombrable,
//      de 1 a 5 criterios;
//   2. contexto mínimo (l02): de 1 a 3 piezas necesarias;
//   3. alcance (l04): lista explícita de archivos permitidos;
//   4. verificación (l05): un comando node --test que termina en .test.js.
// La serie completa admite de 3 a 5 tareas con identificadores únicos.
//
// Uso: node comprobar-serie.js [ruta-de-la-serie.js]
//   Por defecto valida ./serie.js; con argumento, la serie indicada
//   (por ejemplo errores/serie-rota.js, que debe fallar).

import { pathToFileURL } from "node:url";

/** Reglas 1 a 4 aplicadas a una tarea; devuelve las incidencias. */
export function revisarTarea(tarea) {
  const incidencias = [];
  const id = tarea.id ?? "(sin id)";

  // 1. anatomía (l01)
  const instruccion = typeof tarea.instruccion === "string" ? tarea.instruccion.trim() : "";
  if (instruccion.length < 40) {
    incidencias.push(`${id}: instrucción vaga (${instruccion.length} caracteres; el curso exige 40)`);
  }
  const entregable = typeof tarea.entregable === "string" ? tarea.entregable.trim() : "";
  if (entregable.length === 0) {
    incidencias.push(`${id}: sin entregable nombrable`);
  }
  const criterios = Array.isArray(tarea.criterios) ? tarea.criterios : [];
  if (criterios.length < 1 || criterios.length > 5) {
    incidencias.push(`${id}: ${criterios.length} criterios; el curso admite de 1 a 5`);
  }

  // 2. contexto mínimo (l02)
  const contexto = Array.isArray(tarea.contexto) ? tarea.contexto : [];
  if (contexto.length < 1 || contexto.length > 3) {
    incidencias.push(`${id}: ${contexto.length} piezas de contexto; el curso admite de 1 a 3`);
  }

  // 3. alcance (l04)
  const permitidos = Array.isArray(tarea.archivosPermitidos) ? tarea.archivosPermitidos : [];
  if (permitidos.length === 0) {
    incidencias.push(`${id}: sin archivos permitidos declarados (sin frontera)`);
  }

  // 4. verificación (l05)
  const verificacion = typeof tarea.verificacion === "string" ? tarea.verificacion.trim() : "";
  if (!verificacion.startsWith("node --test ") || !verificacion.endsWith(".test.js")) {
    incidencias.push(`${id}: verificación «${verificacion || "(vacía)"}» no es un comando node --test`);
  }

  return incidencias;
}

/** Valida una serie completa; devuelve las incidencias. */
export function revisarSerie(serie) {
  const incidencias = [];
  if (!Array.isArray(serie) || serie.length < 3 || serie.length > 5) {
    incidencias.push(`la serie tiene ${Array.isArray(serie) ? serie.length : 0} tareas; el curso admite de 3 a 5`);
    return incidencias;
  }
  const ids = serie.map((tarea) => tarea.id);
  if (new Set(ids).size !== ids.length) {
    incidencias.push(`identificadores repetidos: ${ids.join(", ")}`);
  }
  for (const tarea of serie) incidencias.push(...revisarTarea(tarea));
  return incidencias;
}

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("comprobar-serie.js")) {
  const ruta = process.argv[2] ?? "./serie.js";
  const { serie } = await import(pathToFileURL(ruta).href);
  const incidencias = revisarSerie(serie);

  if (incidencias.length > 0) {
    for (const incidencia of incidencias) console.error(`✗ ${incidencia}`);
    console.error(`serie NO válida: ${incidencias.length} incidencias`);
    process.exit(1);
  }

  const criterios = serie.reduce((total, tarea) => total + tarea.criterios.length, 0);
  console.log(`serie válida: ${serie.length} tareas, ${criterios} criterios, ${serie.length} comandos de verificación`);
}
