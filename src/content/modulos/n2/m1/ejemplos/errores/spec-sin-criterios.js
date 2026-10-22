// spec-sin-criterios.js — rojo: una spec sin «esperado» no es ejecutable.
// La especificación promete criterios que se puedan comprobar; un criterio
// sin entrada y esperado parseables es prosa, y leerSpec lo rechaza en el
// momento en que se intenta leer.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { leerSpec } from "../ciclo.js";

const dir = mkdtempSync(join(tmpdir(), "n2m1-rojo-spec-"));
const ruta = join(dir, "spec.md");
writeFileSync(
  ruta,
  [
    "# Spec — total de factura",
    "",
    "## Contrato",
    "",
    "Función: `totalFactura(lineas)`.",
    "",
    "## Criterios",
    "",
    "### C1 · total de una línea sin impuesto ni descuento",
    "entrada: [[{\"importe\": 100, \"impuesto\": 0, \"descuento\": 0}]]",
    "esperado: 100",
    "",
    "### C2 · el descuento se aplica antes que el impuesto",
    "el resultado debe ser correcto y el redondeo, razonable",
    "",
  ].join("\n"),
);

try {
  leerSpec(ruta);
  console.log("✗ la spec sin «esperado» fue aceptada: el validador no sirve");
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
