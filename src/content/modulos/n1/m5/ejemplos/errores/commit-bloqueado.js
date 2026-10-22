/**
 * Rojo de l04 — El pre-commit bloquea el commit de una infracción.
 * Repo temporal con el hook instalado: el commit de src/informe.js sin prueba aborta.
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ejecutarGit, prepararRepoConReglas } from "../reglas.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));
const DIR_RAIZ = dirname(DIR_EJEMPLOS);

const repo = mkdtempSync(join(tmpdir(), "n1m5-red-hook-"));
try {
  ejecutarGit(repo, "init", "-q", "-b", "main");
  ejecutarGit(repo, "config", "user.name", "Rojo n1/m5");
  ejecutarGit(repo, "config", "user.email", "rojo@example.invalid");
  prepararRepoConReglas(repo, DIR_RAIZ);
  ejecutarGit(repo, "add", ".");

  writeFileSync(
    join(repo, "proyecto", "src", "informe.js"),
    'export function informe() {\n  return "sin prueba";\n}\n',
  );
  ejecutarGit(repo, "add", ".");

  const commit = ejecutarGit(repo, "commit", "-m", "añade informe sin prueba");
  console.log('$ git commit -m "añade informe sin prueba"');
  console.log(commit.stderr);
  console.log(commit.stdout);
  console.log(`git exit ${commit.estado}`);
  console.log("commit bloqueado por el pre-commit: src/informe.js sin test/informe.test.js");
  process.exit(1);
} finally {
  rmSync(repo, { recursive: true, force: true });
}
