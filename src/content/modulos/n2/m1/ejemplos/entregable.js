// entregable.js — demo de l06: certificar el ciclo completo.
// Condiciones: plan con sus 4 secciones, spec con criterios ejecutables, todos
// los criterios cumplidos, ninguna función exportada fuera de la spec y suite
// en verde. Si alguna cae, el entregable no está.
import { certificar } from "./ciclo.js";

const dir = process.argv[2] ?? "proyecto";
const { condiciones, incidencias } = await certificar(dir);
for (const condicion of condiciones) {
  console.log(` ✓ ${condicion}`);
}
for (const incidencia of incidencias) {
  console.log(` ✗ ${incidencia}`);
}
if (incidencias.length === 0) {
  console.log("entregable válido: funcionalidad entregada con su spec y sus tests");
} else {
  console.log(`entregable NO válido: ${incidencias.length} incidencias`);
  process.exitCode = 1;
}
