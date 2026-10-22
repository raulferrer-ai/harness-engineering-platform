/**
 * Demo de l04: el mismo runner, ahora en el camino del commit (pre-commit).
 * El hook vive en .git/hooks/pre-commit y git lo ejecuta antes de crear el commit.
 */
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ejecutarGit, prepararRepoConReglas } from "./reglas.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));

/** Repo temporal con el hook instalado y un commit limpio; devuelve líneas para el informe. */
export function demostrarCommitConHook() {
  const repo = mkdtempSync(join(tmpdir(), "n1m5-hook-"));
  try {
    ejecutarGit(repo, "init", "-q", "-b", "main");
    ejecutarGit(repo, "config", "user.name", "Demo n1/m5");
    ejecutarGit(repo, "config", "user.email", "demo@example.invalid");
    const rutaHook = prepararRepoConReglas(repo, DIR_EJEMPLOS);
    const modo = (statSync(rutaHook).mode & 0o777).toString(8);
    ejecutarGit(repo, "add", ".");
    const commit = ejecutarGit(repo, "commit", "-m", "reglas del repositorio con pre-commit");
    const ver = ejecutarGit(repo, "rev-parse", "--short", "HEAD");
    const lineas = [
      `repo temporal listo: proyecto/, reglas.js, comprobar.js y .git/hooks/pre-commit (modo ${modo})`,
      '$ git commit -m "reglas del repositorio con pre-commit"',
      ...commit.stderr.split("\n"),
      ...commit.stdout.split("\n"),
      `commit creado (${ver.stdout}) — el pre-commit ejecutó las 4 reglas antes de escribirlo`,
    ];
    return { lineas, estado: commit.estado };
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { lineas, estado } = demostrarCommitConHook();
  for (const linea of lineas) {
    console.log(linea);
  }
  if (estado !== 0) {
    console.log("el commit limpio NO pasó el pre-commit — la demo falla");
    process.exitCode = 1;
  }
}
