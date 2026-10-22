/**
 * Demo de l01: las convenciones repetidas del proyecto, declaradas como reglas.
 * Un id + una descripción + una comprobación = regla ejecutable.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPROBACIONES, leerReglas, plural } from "./reglas.js";

const DIR_DEFECTO = join(dirname(fileURLToPath(import.meta.url)), "proyecto");

/** Presenta las reglas declaradas y su estado de implementación. */
export function presentarReglas(dirProyecto, rutaReglas = join(dirProyecto, "reglas.json")) {
  const { titulo, reglas } = leerReglas(rutaReglas);
  const lineas = [`reglas declaradas en ${rutaReglas}: ${reglas.length} (${titulo})`];
  let implementadas = 0;
  for (const { id, descripcion } of reglas) {
    const tieneComprobacion = typeof COMPROBACIONES[id]?.comprobar === "function";
    if (tieneComprobacion) {
      implementadas += 1;
    }
    lineas.push(` ${id} — ${descripcion} · comprobación: ${tieneComprobacion ? "implementada" : "TODAVÍA NO"}`);
  }
  lineas.push(
    implementadas === reglas.length
      ? `${plural(implementadas, "regla", "reglas")} de ${reglas.length} con comprobación — todas son ejecutables`
      : `${plural(reglas.length - implementadas, "regla declarada", "reglas declaradas")} sin comprobación — quedan en papel mojado`,
  );
  return { lineas, implementadas, declaradas: reglas.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { lineas } = presentarReglas(process.argv[2] ?? DIR_DEFECTO);
  for (const linea of lineas) {
    console.log(linea);
  }
}
