// entregable.js — demo de l06: certificar el entregable del módulo.
// Condiciones: la colección personal existe y está bien formada (leerColeccion
// lanza si no lo está), todos los fallos declarados tienen comprobación
// ejecutable, el runner los confirma a todos y los tres tipos del módulo están
// representados en la colección.
import { DETECTORES, RUTA_COLECCION, detectarColeccion, leerColeccion, plural } from "./fallos.js";

const ruta = process.argv[2] ?? RUTA_COLECCION;
const condiciones = [];
const incidencias = [];

// 1) La colección existe y cada entrada tiene id, tipo y titulo (sino,
//    leerColeccion lanza y el proceso termina en rojo con su traza).
const { fallos } = leerColeccion(ruta);
condiciones.push(`colección: ${plural(fallos.length, "entrada bien formada", "entradas bien formadas")}`);

// 2) Ningún fallo declarado se queda sin comprobación ejecutable.
const sinComprobacion = fallos.filter((fallo) => fallo.comprobacion === undefined);
if (sinComprobacion.length > 0) {
  incidencias.push(
    `${plural(sinComprobacion.length, "fallo", "fallos")} sin comprobación: ${sinComprobacion
      .map((fallo) => fallo.id)
      .join(", ")}`,
  );
} else {
  condiciones.push("detecciones: todos los fallos declarados tienen comprobación");
}

// 3) El runner confirma cada fallo con su detector.
const { total, detectados, incidencias: delRunner } = await detectarColeccion(ruta);
if (delRunner.length > 0) {
  incidencias.push(...delRunner);
} else {
  condiciones.push(`runner: ${plural(detectados, "fallo", "fallos")} de ${total} confirmados (exit 0)`);
}

// 4) Los tres tipos del módulo tienen representación en la colección.
const tipos = new Set(fallos.map((fallo) => fallo.tipo));
const faltan = Object.keys(DETECTORES).filter((tipo) => !tipos.has(tipo));
if (faltan.length > 0) {
  incidencias.push(`tipos sin representación: ${faltan.join(", ")}`);
} else {
  condiciones.push(`tipos: ${[...tipos].sort().join(", ")} — los 3 del módulo`);
}

for (const condicion of condiciones) {
  console.log(` ✓ ${condicion}`);
}
if (incidencias.length === 0) {
  console.log(`entregable válido: colección personal de ${fallos.length} fallos con detección`);
} else {
  for (const incidencia of incidencias) {
    console.log(` ✗ ${incidencia}`);
  }
  console.log(`entregable NO válido: ${plural(incidencias.length, "incidencia", "incidencias")}`);
  process.exitCode = 1;
}
