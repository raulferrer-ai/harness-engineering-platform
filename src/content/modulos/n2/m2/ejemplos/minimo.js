// minimo.js — demo de l03: verde mínimo y alcance cerrado.
// El asistente sólo puede tocar lo que los tests piden: cada exportación se
// busca en el fichero de tests y la que nadie prueba, sobra. El verde se
// acepta; el sobrante, no.
import { join } from "node:path";

import { alcance, ejecutarSuite } from "./tdd.js";

const dirFeature = process.argv[2] ?? "feature";
const suite = ejecutarSuite(dirFeature);
const al = alcance(
  join(dirFeature, "contrasena.js"),
  join(dirFeature, "test", "contrasena.test.js"),
);

console.log(`verde: ${suite.pass} pruebas en verde — sólo el comportamiento que los tests piden`);
console.log(
  `alcance: ${al.exportadas.length} funciones exportadas, ${al.probadas.length} probadas — ${al.sobrantes.length} fuera de los tests`,
);
if (al.sobrantes.length > 0) {
  console.log(
    `✗ fuera del alcance de los tests: ${al.sobrantes.join(", ")} — nadie lo pidió con una prueba`,
  );
}

const conforme = suite.status === 0 && al.sobrantes.length === 0;
if (!conforme) process.exitCode = 1;
