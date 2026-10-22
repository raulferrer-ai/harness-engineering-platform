// criterio-sin-test.js — rojo: la spec creció y nadie la siguió.
// C5 se declaró en la spec, pero la implementación y la suite siguen como
// estaban. El ciclo no se entera de que «falta el test»: se entera de que el
// criterio no se cumple. Esa diferencia es el motor de todo el módulo.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ejecutarCriterios, leerSpec } from "../ciclo.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m1-rojo-criterio-"));

try {
  cpSync(join(DIR_EJEMPLOS, "proyecto"), join(dir, "proyecto"), { recursive: true });
  const rutaSpec = join(dir, "proyecto", "spec.md");
  writeFileSync(
    rutaSpec,
    `${readFileSync(rutaSpec, "utf8")}
### C5 · el importe negativo se rechaza
entrada: [[{"importe": -1, "impuesto": 0, "descuento": 0}]]
esperado: {"error": "RangeError"}
`,
  );

  const spec = leerSpec(rutaSpec);
  const resultados = await ejecutarCriterios(spec, join(dir, "proyecto"));
  const incumplidos = resultados.filter((resultado) => !resultado.ok);
  for (const incumplido of incumplidos) {
    console.log(` ✗ ${incumplido.detalle}`);
  }
  console.log(
    `la spec creció a ${resultados.length} criterios y la implementación no la siguió: ${incumplidos.length} sin cumplir`,
  );
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
