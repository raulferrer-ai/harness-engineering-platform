// rojo-falso.js — rojo de l02: un import roto no es un rojo.
// El fichero de tests importa una función que no existe: la suite muere al
// cargarlo y ninguna prueba se ejecuta, así que el fallo no dice nada de la
// feature. Se sale en 1: esto no sirve como encargo para el asistente.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { clasificar, ejecutarSuite } from "../tdd.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m2-rojo-falso-"));

try {
  cpSync(join(DIR_EJEMPLOS, "feature"), join(dir, "feature"), { recursive: true });
  const rutaTests = join(dir, "feature", "test", "contrasena.test.js");
  const original = readFileSync(rutaTests, "utf8");
  writeFileSync(
    rutaTests,
    original.replace("import { esValida, incumplidas }", "import { esValidaRota, incumplidas }"),
  );

  const suite = ejecutarSuite(join(dir, "feature"));
  const veredicto = clasificar(suite);
  console.log(" el fichero de tests importa una función que no existe: esValida → esValidaRota");
  console.log(`✗ rojo falso: ${veredicto.detalle}`);
  console.log(" ningún comportamiento se puso a prueba: el rojo hay que volver a escribirlo");
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
