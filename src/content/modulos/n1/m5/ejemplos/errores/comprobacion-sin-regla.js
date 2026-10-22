/**
 * Rojo de l05 — Comprobación implementada sin regla declarada (el otro sentido de la deriva).
 * Quita r4 del reglas.json de una copia: COMPROBACIONES.r4 queda huérfana en reglas.js.
 */
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validarReglas } from "../validar-reglas.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));
const DIR_PROYECTO = join(dirname(DIR_EJEMPLOS), "proyecto");

const dir = mkdtempSync(join(tmpdir(), "n1m5-red-sin-regla-"));
try {
  cpSync(DIR_PROYECTO, dir, { recursive: true });
  const rutaReglas = join(dir, "reglas.json");
  const datos = JSON.parse(readFileSync(rutaReglas, "utf8"));
  datos.reglas = datos.reglas.filter((regla) => regla.id !== "r4");
  writeFileSync(rutaReglas, `${JSON.stringify(datos, null, 2)}\n`);

  const incidencias = validarReglas(dir, rutaReglas);
  for (const incidencia of incidencias) {
    console.log(`✗ ${incidencia}`);
  }
  console.log("una comprobación sin regla declarada es código muerto con apariencia de control");
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
