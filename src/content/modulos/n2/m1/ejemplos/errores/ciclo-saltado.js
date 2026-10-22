// ciclo-saltado.js — rojo: entregar sin haber pasado por la spec.
// El proyecto tiene plan, implementación y suite verde, pero la especificación
// no está: no hay contrato que certificar. readFileSync lanza ENOENT antes de
// que el certificador pueda siquiera empezar a contar condiciones.
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { certificar } from "../ciclo.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = mkdtempSync(join(tmpdir(), "n2m1-rojo-saltado-"));

try {
  cpSync(join(DIR_EJEMPLOS, "proyecto"), join(dir, "proyecto"), { recursive: true });
  rmSync(join(dir, "proyecto", "spec.md"));

  await certificar(join(dir, "proyecto"));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
