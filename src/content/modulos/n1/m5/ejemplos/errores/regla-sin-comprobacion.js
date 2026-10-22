/**
 * Rojo de l05 — Regla declarada sin comprobación (el lado declarado va por delante).
 * Añade r5 al reglas.json de una copia: el validador exige su implementación.
 */
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validarReglas } from "../validar-reglas.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));
const DIR_PROYECTO = join(dirname(DIR_EJEMPLOS), "proyecto");

const dir = mkdtempSync(join(tmpdir(), "n1m5-red-sin-comprobacion-"));
try {
  cpSync(DIR_PROYECTO, dir, { recursive: true });
  const rutaReglas = join(dir, "reglas.json");
  const datos = JSON.parse(readFileSync(rutaReglas, "utf8"));
  datos.reglas.push({ id: "r5", descripcion: "ningún console.log en src/" });
  writeFileSync(rutaReglas, `${JSON.stringify(datos, null, 2)}\n`);

  const incidencias = validarReglas(dir, rutaReglas);
  for (const incidencia of incidencias) {
    console.log(`✗ ${incidencia}`);
  }
  console.log("el validador se niega a ejecutar una regla que sólo existe en papel");
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
