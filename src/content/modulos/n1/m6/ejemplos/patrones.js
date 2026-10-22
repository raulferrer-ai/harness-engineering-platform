// patrones.js — demo de l01: la colección personal, fallo a fallo.
// Presenta cada entrada (id, tipo, titulo, ejemplo, detección) y resume cuántos
// fallos tienen comprobación ejecutable frente a los que sólo existen en papel.
import { RUTA_COLECCION, leerColeccion, plural } from "./fallos.js";

const ruta = process.argv[2] ?? RUTA_COLECCION;
const { titulo, fallos } = leerColeccion(ruta);

console.log(`colección: ${titulo} (${ruta})`);
const porTipo = new Map();
let conComprobacion = 0;
for (const fallo of fallos) {
  const ejecutable = fallo.comprobacion !== undefined;
  if (ejecutable) conComprobacion += 1;
  porTipo.set(fallo.tipo, (porTipo.get(fallo.tipo) ?? 0) + 1);
  console.log(`${fallo.id} · ${fallo.tipo} — ${fallo.titulo}`);
  console.log(`    ejemplo: ${fallo.ejemplo}`);
  console.log(`    detección: ${fallo.deteccion}`);
  console.log(`    comprobación: ${ejecutable ? "✓ ejecutable" : "✗ sólo en papel"}`);
}

const tipos = [...porTipo].map(([tipo, cantidad]) => `${tipo} ${cantidad}`).join(", ");
console.log(
  `${plural(conComprobacion, "fallo", "fallos")} de ${fallos.length} con detección — tipos: ${tipos}`,
);
if (conComprobacion !== fallos.length) {
  console.log("la colección declara fallos sin comprobación: no son detectables todavía");
  process.exitCode = 1;
}
