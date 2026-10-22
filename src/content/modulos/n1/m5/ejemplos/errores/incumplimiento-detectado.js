/**
 * Rojo de l02/l03 — El runner decide con su código de salida.
 * Copia el proyecto, borra una prueba y ejecuta comprobar.js: sale con 1.
 */
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));
const DIR_PROYECTO = join(dirname(DIR_EJEMPLOS), "proyecto");

const dir = mkdtempSync(join(tmpdir(), "n1m5-red-"));
try {
  cpSync(DIR_PROYECTO, dir, { recursive: true });
  rmSync(join(dir, "test", "total.test.js"));

  const resultado = spawnSync(process.execPath, [join(dirname(DIR_EJEMPLOS), "comprobar.js"), dir], {
    cwd: dirname(DIR_EJEMPLOS),
    encoding: "utf8",
  });
  console.log(resultado.stdout.trim());
  console.log(`$ node comprobar.js  →  exit ${resultado.status}`);
  console.log("el runner no permite el commit — una prueba fue borrada y la regla r1 la echa de menos");
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
