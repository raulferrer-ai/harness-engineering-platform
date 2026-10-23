// verde-trampa.js — rojo de l06: verde porque borraron una prueba.
// Alguien «arregló» el rojo quitando la prueba molesta: la suite queda verde
// (5/5) y el registro sigue declarando sus 6 ciclos. El cruce registro ↔
// tests lo detecta: verde no basta, la cobertura tiene que cuadrar. Se sale en 1.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { certificar, ejecutarSuite } from "../tdd.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m2-trampa-"));

try {
  cpSync(join(DIR_EJEMPLOS, "feature"), join(dir, "feature"), { recursive: true });
  const rutaTests = join(dir, "feature", "test", "contrasena.test.js");
  const original = readFileSync(rutaTests, "utf8");
  const sinPrueba = original.replace(
    '  it("esValida: una entrada que no es texto no vale", () => {\n    assert.strictEqual(esValida(null), false);\n  });\n\n',
    "",
  );
  if (sinPrueba === original) {
    throw new Error("el patrón del borrado no casó: la prueba no cambió");
  }
  writeFileSync(rutaTests, sinPrueba);

  const suite = ejecutarSuite(join(dir, "feature"));
  console.log(`verde: ${suite.pass} pruebas en verde — la suite se ve sana`);

  const { condiciones, incidencias } = certificar(join(dir, "feature"));
  for (const condicion of condiciones) console.log(` ✓ ${condicion}`);
  for (const incidencia of incidencias) console.log(` ✗ ${incidencia}`);
  console.log(`entregable NO válido: ${incidencias.length} incidencias`);
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
