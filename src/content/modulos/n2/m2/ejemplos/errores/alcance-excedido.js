// alcance-excedido.js — rojo de l03: el asistente se pasó de la lista.
// La suite sigue verde (6 pruebas), pero la implementación exporta una
// función que ningún test pidió. El verde no cubre el añadido: el alcance lo
// fijan las pruebas, no el ánimo del generador. Se sale en 1.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { alcance, ejecutarSuite } from "../tdd.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m2-alcance-"));

try {
  cpSync(join(DIR_EJEMPLOS, "feature"), join(dir, "feature"), { recursive: true });
  const rutaImpl = join(dir, "feature", "contrasena.js");
  writeFileSync(
    rutaImpl,
    `${readFileSync(rutaImpl, "utf8")}
// Comportamiento inventado: ningún test lo pidió.
export function generarContrasena() {
  return "Abcdefg1";
}
`,
  );

  const suite = ejecutarSuite(join(dir, "feature"));
  const al = alcance(rutaImpl, join(dir, "feature", "test", "contrasena.test.js"));
  console.log(`verde: ${suite.pass} pruebas en verde — la suite no ve el añadido`);
  console.log(
    `alcance: ${al.exportadas.length} funciones exportadas, ${al.probadas.length} probadas — ${al.sobrantes.length} fuera de los tests`,
  );
  console.log(`✗ fuera del alcance de los tests: ${al.sobrantes.join(", ")} — nadie lo pidió con una prueba`);
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
