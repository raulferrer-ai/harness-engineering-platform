/**
 * Demo de l06: el entregable certificado — reglas del repositorio + pre-commit.
 * En un repo temporal: deriva 0, commit limpio pasado, commit infractor bloqueado.
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ejecutarGit, prepararRepoConReglas } from "./reglas.js";
import { validarReglas } from "./validar-reglas.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));

/** Certifica el entregable completo y devuelve líneas para el informe. */
export function certificarEntregable() {
  const repo = mkdtempSync(join(tmpdir(), "n1m5-entregable-"));
  try {
    ejecutarGit(repo, "init", "-q", "-b", "main");
    ejecutarGit(repo, "config", "user.name", "Demo n1/m5");
    ejecutarGit(repo, "config", "user.email", "demo@example.invalid");
    prepararRepoConReglas(repo, DIR_EJEMPLOS);

    const deriva = validarReglas(join(repo, "proyecto"));

    ejecutarGit(repo, "add", ".");
    const limpio = ejecutarGit(repo, "commit", "-m", "reglas del repositorio con pre-commit");

    writeFileSync(
      join(repo, "proyecto", "src", "informe.js"),
      'export function informe() {\n  return "sin prueba";\n}\n',
    );
    ejecutarGit(repo, "add", ".");
    const infractor = ejecutarGit(repo, "commit", "-m", "añade informe sin prueba");

    const valido = deriva.length === 0 && limpio.estado === 0 && infractor.estado !== 0;
    const lineas = [
      `reglas: 4 declaradas, 4 comprobaciones, deriva ${deriva.length}`,
      `commit limpio: ${limpio.estado === 0 ? "pasado" : "NO pasado"} (git exit ${limpio.estado})`,
      `commit con src/informe.js sin prueba: ${infractor.estado !== 0 ? "bloqueado" : "NO bloqueado"} (git exit ${infractor.estado})`,
      `${valido ? "entregable válido" : "entregable NO válido"}: reglas del repositorio + pre-commit`,
    ];
    return { lineas, valido };
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { lineas, valido } = certificarEntregable();
  for (const linea of lineas) {
    console.log(linea);
  }
  if (!valido) {
    console.log("el entregable NO cumple sus tres condiciones");
    process.exitCode = 1;
  }
}
