// flujo-completo.test.js — el flujo rama → revisión → fusión con Git real (l07)
// Cada prueba crea un repositorio temporal de verdad, ejecuta el flujo con
// child_process y comprueba el resultado. Al terminar se borra todo.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

const temporales = [];

after(() => {
  for (const carpeta of temporales) rmSync(carpeta, { recursive: true, force: true });
});

/** Ejecuta git en `cwd` y devuelve su salida recortada. */
function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

/** Repositorio temporal con identidad local: la base de cada prueba. */
function repositorioBase() {
  const raiz = mkdtempSync(join(tmpdir(), "flujo-"));
  temporales.push(raiz);
  const repo = join(raiz, "proyecto");
  mkdirSync(repo);
  execFileSync("git", ["init", "-q"], { cwd: repo });
  git(repo, "config", "user.name", "Demo Flujo");
  git(repo, "config", "user.email", "demo@example.invalid");
  const rama = git(repo, "symbolic-ref", "--short", "HEAD");
  return { repo, rama };
}

test("el historial inicial registra cada concepto en su commit", () => {
  const { repo } = repositorioBase();
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85\n");
  git(repo, "add", "gastos.csv");
  git(repo, "commit", "-q", "-m", "Añade gastos.csv");
  writeFileSync(join(repo, "README.md"), "# gastos\n");
  git(repo, "add", "README.md");
  git(repo, "commit", "-q", "-m", "Documenta el proyecto en el README");

  const historial = git(repo, "log", "--oneline");
  assert.strictEqual(historial.split("\n").length, 2);
  assert.match(historial, /Añade gastos\.csv/);
  assert.match(historial, /Documenta el proyecto en el README/);
});

test("la rama del cambio aporta solo sus commits", () => {
  const { repo, rama } = repositorioBase();
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85\n");
  git(repo, "add", "gastos.csv");
  git(repo, "commit", "-q", "-m", "Añade gastos.csv");

  git(repo, "switch", "-q", "-c", "anade-cine");
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85\ncine,9.00\n");
  git(repo, "commit", "-qam", "Añade cine al CSV");

  const deLaRama = git(repo, "log", `${rama}..anade-cine`, "--oneline");
  assert.strictEqual(deLaRama.split("\n").length, 1);
  assert.match(deLaRama, /Añade cine al CSV/);
  assert.strictEqual(git(repo, "log", "-1", "--format=%s", rama), "Añade gastos.csv");
});

test("el diff de revisión con tres puntos muestra solo lo de la rama", () => {
  const { repo, rama } = repositorioBase();
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85\n");
  git(repo, "add", "gastos.csv");
  git(repo, "commit", "-q", "-m", "Añade gastos.csv");

  git(repo, "switch", "-q", "-c", "formatea-importes");
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85 EUR\n");
  git(repo, "commit", "-qam", "Formatea los importes con moneda");

  const diff = git(repo, "diff", `${rama}...formatea-importes`);
  assert.match(diff, /^\+pan,1\.85 EUR$/m);
  assert.match(diff, /^-pan,1\.85$/m);
});

test("la fusión --no-ff deja constancia en el historial", () => {
  const { repo, rama } = repositorioBase();
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85\n");
  git(repo, "add", "gastos.csv");
  git(repo, "commit", "-q", "-m", "Añade gastos.csv");

  git(repo, "switch", "-q", "-c", "anade-cine");
  writeFileSync(join(repo, "gastos.csv"), "pan,1.85\ncine,9.00\n");
  git(repo, "commit", "-qam", "Añade cine al CSV");
  git(repo, "switch", "-q", rama);
  git(repo, "merge", "-q", "--no-ff", "anade-cine", "-m", "Fusiona anade-cine");

  assert.match(git(repo, "log", "--oneline", "--merges"), /Fusiona anade-cine/);
  assert.match(readFileSync(join(repo, "gastos.csv"), "utf8"), /cine,9\.00/);
  assert.strictEqual(git(repo, "status", "--short"), "");
});

test("el push sube la historia completa al remoto", () => {
  const { repo, rama } = repositorioBase();
  const origen = join(tmpdir(), `flujo-origin-${Date.now()}.git`);
  temporales.push(origen);
  execFileSync("git", ["init", "-q", "--bare", origen]);
  writeFileSync(join(repo, "saludo.txt"), "hola\n");
  git(repo, "add", "saludo.txt");
  git(repo, "commit", "-q", "-m", "Añade saludo.txt");
  git(repo, "remote", "add", "origin", origen);
  git(repo, "push", "-q", "-u", "origin", rama);

  const clon = join(tmpdir(), `flujo-clon-${Date.now()}`);
  temporales.push(clon);
  execFileSync("git", ["clone", "-q", origen, clon]);
  assert.match(git(clon, "log", "--oneline"), /Añade saludo\.txt/);
});

test("el push divergente se rechaza y se recupera con pull", () => {
  const { repo, rama } = repositorioBase();
  const origen = join(tmpdir(), `flujo-origin-div-${Date.now()}.git`);
  temporales.push(origen);
  execFileSync("git", ["init", "-q", "--bare", origen]);
  writeFileSync(join(repo, "notas.txt"), "base\n");
  git(repo, "add", "notas.txt");
  git(repo, "commit", "-q", "-m", "Añade notas.txt");
  git(repo, "remote", "add", "origin", origen);
  git(repo, "push", "-q", "-u", "origin", rama);

  const clon = join(tmpdir(), `flujo-clon-div-${Date.now()}`);
  temporales.push(clon);
  execFileSync("git", ["clone", "-q", origen, clon]);
  git(clon, "config", "user.name", "Companero");
  git(clon, "config", "user.email", "companero@example.invalid");
  writeFileSync(join(clon, "equipo.txt"), "primera línea del equipo\n");
  git(clon, "add", "equipo.txt");
  git(clon, "commit", "-q", "-m", "Añade equipo.txt");
  git(clon, "push", "-q");

  writeFileSync(join(repo, "escritorio.txt"), "primera línea de mi escritorio\n");
  git(repo, "add", "escritorio.txt");
  git(repo, "commit", "-q", "-m", "Añade escritorio.txt");
  const rechazo = spawnFallido(repo, ["push", "origin", rama]);
  assert.strictEqual(rechazo.status, 1);
  assert.match(rechazo.stderr, /rejected/);

  git(repo, "pull", "-q", "--no-rebase");
  git(repo, "push", "-q", "origin", rama);
  assert.strictEqual(git(repo, "status", "--short"), "");
  assert.match(git(repo, "log", "--oneline"), /equipo\.txt/);
});

test("el reflog recupera el commit «perdido» tras un reset --hard", () => {
  const { repo } = repositorioBase();
  writeFileSync(join(repo, "resumen.txt"), "total: 83.69\n");
  git(repo, "add", "resumen.txt");
  git(repo, "commit", "-q", "-m", "Añade resumen.txt");
  writeFileSync(join(repo, "resumen.txt"), "total: 83.69\nfecha: 2026-10-21\n");
  git(repo, "add", "resumen.txt");
  git(repo, "commit", "-q", "-m", "Añade la fecha al resumen");
  const perdido = git(repo, "rev-parse", "HEAD");

  git(repo, "reset", "-q", "--hard", "HEAD~1");
  assert.ok(!readFileSync(join(repo, "resumen.txt"), "utf8").includes("fecha"));

  git(repo, "reset", "-q", "--hard", perdido);
  assert.match(readFileSync(join(repo, "resumen.txt"), "utf8"), /fecha: 2026-10-21/);
  assert.match(git(repo, "reflog", "-n", "3"), /reset/);
});

/** Ejecuta git esperando fallo y devuelve el resultado completo. */
function spawnFallido(cwd, args) {
  return spawnSync("git", args, { cwd, encoding: "utf8" });
}
