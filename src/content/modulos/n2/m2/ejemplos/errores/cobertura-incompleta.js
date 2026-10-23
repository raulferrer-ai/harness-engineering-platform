// cobertura-incompleta.js — rojo de l04: un ciclo que nunca se cerró.
// El registro pierde el «verde» de una prueba: sigue siendo historia, pero
// no es cobertura. Puede la suite estar verde y el recorrido incompleto — y
// eso es exactamente lo que la entrega no puede permitirse. Se sale en 1.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { cobertura, leerRegistro } from "../tdd.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m2-cobertura-"));

try {
  cpSync(join(DIR_EJEMPLOS, "feature"), join(dir, "feature"), { recursive: true });
  const rutaRegistro = join(dir, "feature", "registro.json");
  const registro = JSON.parse(readFileSync(rutaRegistro, "utf8"));
  delete registro.ciclos[1].verde;
  writeFileSync(rutaRegistro, JSON.stringify(registro, null, 2));

  const cob = cobertura(
    leerRegistro(rutaRegistro),
    join(dir, "feature", "test", "contrasena.test.js"),
  );
  console.log(`cobertura rojos→verdes: ${cob.cubiertas}/${cob.total} pruebas con su ciclo`);
  for (const titulo of cob.sinCerrar) console.log(`✗ prueba sin cerrar rojo y verde: ${titulo}`);
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
