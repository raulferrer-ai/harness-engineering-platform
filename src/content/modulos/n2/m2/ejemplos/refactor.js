// refactor.js — demo de l05: reorganizar sin cambiar el comportamiento.
// Antes y después con la misma suite: si las 6 siguen verdes con otro
// interior, el refactor no rompió el contrato que los tests definen.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ejecutarSuite } from "./tdd.js";

const dir = mkdtempSync(join(tmpdir(), "n2m2-refactor-"));
try {
  cpSync("feature", join(dir, "feature"), { recursive: true });
  const dirFeature = join(dir, "feature");
  const rutaImpl = join(dirFeature, "contrasena.js");

  const antes = ejecutarSuite(dirFeature);

  const original = readFileSync(rutaImpl, "utf8");
  const refactorizado = original.replace(
    "  return REGLAS.filter((regla) => !regla.cumple(contrasena)).map((regla) => regla.id);",
    [
      "  const fallan = [];",
      "  for (const regla of REGLAS) {",
      "    if (!regla.cumple(contrasena)) fallan.push(regla.id);",
      "  }",
      "  return fallan;",
    ].join("\n"),
  );
  if (refactorizado === original) {
    throw new Error("el patrón del refactor no casó: el fichero no cambió");
  }
  writeFileSync(rutaImpl, refactorizado);

  const despues = ejecutarSuite(dirFeature);
  const mismoVerde =
    antes.status === 0 && despues.status === 0 && antes.pass === despues.pass;
  console.log(`antes: ${antes.pass} pruebas en verde`);
  console.log(`después: ${despues.pass} pruebas en verde — mismas exportaciones, otro interior`);
  console.log(
    mismoVerde
      ? `refactor: ${despues.pass} pruebas verdes antes y después — el comportamiento no cambió`
      : "refactor roto: la suite no quedó como estaba",
  );
  if (!mismoVerde) process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
