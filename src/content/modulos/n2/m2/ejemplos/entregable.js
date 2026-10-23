// entregable.js — demo de l06: la feature certificada de punta a punta.
// Tres condiciones y ninguna opcional: suite en verde, cobertura
// rojos→verdes completa y ninguna exportación sin prueba que la pida.
import { certificar } from "./tdd.js";

const dirFeature = process.argv[2] ?? "feature";
const { condiciones, incidencias } = certificar(dirFeature);

for (const condicion of condiciones) console.log(` ✓ ${condicion}`);
for (const incidencia of incidencias) console.log(` ✗ ${incidencia}`);
if (incidencias.length === 0) {
  console.log(
    "entregable: cobertura de tests rojos→verdes completa — suite verde, ciclos cerrados, alcance sin sobrantes",
  );
} else {
  console.log(`entregable NO válido: ${incidencias.length} incidencias`);
}
process.exitCode = incidencias.length === 0 ? 0 : 1;
