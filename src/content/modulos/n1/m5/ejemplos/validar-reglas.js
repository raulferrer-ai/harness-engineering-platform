/**
 * Demo de l05: la deriva entre lo declarado (reglas.json) y lo implementado (reglas.js).
 * La regla sólo es real si está en los dos lados; el validador mira ambos sentidos.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPROBACIONES, leerReglas } from "./reglas.js";

const DIR_DEFECTO = join(dirname(fileURLToPath(import.meta.url)), "proyecto");

/** Comprueba que declarado e implementado coinciden en ambos sentidos. */
export function validarReglas(dirProyecto, rutaReglas = join(dirProyecto, "reglas.json")) {
  const { reglas } = leerReglas(rutaReglas);
  const incidencias = [];
  const ids = reglas.map((regla) => regla.id);
  if (new Set(ids).size !== ids.length) {
    incidencias.push(`ids duplicados en reglas.json: ${ids.join(", ")}`);
  }
  for (const id of ids) {
    if (!COMPROBACIONES[id]) {
      incidencias.push(`${id}: regla declarada sin comprobación — está en ${rutaReglas}, no en reglas.js`);
    }
  }
  for (const id of Object.keys(COMPROBACIONES)) {
    if (!ids.includes(id)) {
      incidencias.push(`${id}: comprobación implementada sin regla declarada — está en reglas.js, no en ${rutaReglas}`);
    }
  }
  return incidencias;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dirProyecto = process.argv[2] ?? DIR_DEFECTO;
  const { reglas } = leerReglas(join(dirProyecto, "reglas.json"));
  const incidencias = validarReglas(dirProyecto);
  console.log(`declaradas en reglas.json: ${reglas.length} · comprobaciones en reglas.js: ${Object.keys(COMPROBACIONES).length}`);
  if (incidencias.length === 0) {
    console.log("deriva: 0 — declarado y ejecutado coinciden");
  } else {
    for (const incidencia of incidencias) {
      console.log(` ✗ ${incidencia}`);
    }
    console.log(`deriva: ${incidencias.length} — las reglas no coinciden con sus comprobaciones`);
    process.exitCode = 1;
  }
}
