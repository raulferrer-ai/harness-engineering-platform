// impl-sin-spec.js — rojo: comportamiento inventado fuera de la spec.
// El asistente añadió una función que nadie pidió: no está en el contrato ni
// en ningún criterio. El ciclo no la certifica: o se especifica, o no entra.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { funcionesNoDeclaradas, leerSpec } from "../ciclo.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m1-rojo-funcion-"));

try {
  cpSync(join(DIR_EJEMPLOS, "proyecto"), join(dir, "proyecto"), { recursive: true });
  const rutaImpl = join(dir, "proyecto", "presupuesto.js");
  writeFileSync(
    rutaImpl,
    `${readFileSync(rutaImpl, "utf8")}
// Comportamiento inventado: nadie lo pidió en la spec.
export function formatoMoneda(total) {
  return \`$\${total.toFixed(2)}\`;
}
`,
  );

  const spec = leerSpec(join(dir, "proyecto", "spec.md"));
  const sobrantes = await funcionesNoDeclaradas(spec, join(dir, "proyecto"));
  if (sobrantes.length === 0) {
    console.log("✗ no se detectó ninguna función fuera de la spec");
    process.exitCode = 1;
  } else {
    console.log(` ✗ funciones no declaradas en la spec: ${sobrantes.join(", ")}`);
    console.log("el contrato no admite comportamiento inventado: o se especifica, o no se entrega");
    process.exitCode = 1;
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
