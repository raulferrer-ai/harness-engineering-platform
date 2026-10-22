/**
 * Runner de las reglas del repositorio (demo de l02): declara → ejecuta → decide.
 * Sale con 0 si todas las reglas están en verde y con 1 si alguna falla.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPROBACIONES, leerReglas } from "./reglas.js";

const DIR_DEFECTO = join(dirname(fileURLToPath(import.meta.url)), "proyecto");

/** Ejecuta las reglas declaradas contra un proyecto. */
export function comprobarProyecto(dirProyecto, rutaReglas = join(dirProyecto, "reglas.json")) {
  const { reglas } = leerReglas(rutaReglas);
  const resultados = [];
  const incidencias = [];
  for (const { id, descripcion } of reglas) {
    const comprobacion = COMPROBACIONES[id];
    if (!comprobacion) {
      incidencias.push(`${id}: regla declarada sin comprobación — «${descripcion}» no es ejecutable`);
      continue;
    }
    const { ok, detalle } = comprobacion.comprobar(dirProyecto);
    resultados.push({ id, descripcion, ok, detalle });
    if (!ok) {
      incidencias.push(`${id}: ${detalle}`);
    }
  }
  return { declaradas: reglas.length, resultados, incidencias };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dirProyecto = process.argv[2] ?? DIR_DEFECTO;
  const { declaradas, resultados, incidencias } = comprobarProyecto(dirProyecto);
  console.log(`reglas del repositorio: ${declaradas} declaradas en ${join(dirProyecto, "reglas.json")}`);
  for (const { id, descripcion, ok, detalle } of resultados) {
    console.log(` ${ok ? "✓" : "✗"} ${id} — ${descripcion} — ${detalle}`);
  }
  if (incidencias.length === 0) {
    console.log(`${resultados.length} reglas en verde — el runner permite el commit`);
  } else {
    for (const incidencia of incidencias) {
      console.log(` ✗ ${incidencia}`);
    }
    console.log(`${incidencias.length} de ${declaradas} reglas en rojo — el runner no permite el commit`);
    process.exitCode = 1;
  }
}
