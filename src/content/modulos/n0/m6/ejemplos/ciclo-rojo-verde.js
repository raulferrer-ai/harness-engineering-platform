// ciclo-rojo-verde.js — el ciclo TDD en dos ejecuciones reales (lección l04)
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const carpeta = mkdtempSync(join(tmpdir(), "ciclo-"));

const suite = [
  'import { describe, it } from "node:test";',
  'import assert from "node:assert/strict";',
  'import { sumar } from "./sumar.js";',
  "",
  'describe("sumar", () => {',
  '  it("suma positivos", () => assert.strictEqual(sumar(2, 3), 5));',
  '  it("suma con negativos", () => assert.strictEqual(sumar(-1, 1), 0));',
  '  it("suma ceros", () => assert.strictEqual(sumar(0, 0), 0));',
  "});",
].join("\n");

const rojo = 'export function sumar(a, b) {\n  return a - b; // esqueleto generado: resta por equivocación\n}\n';
const verde = 'export function sumar(a, b) {\n  return a + b;\n}\n';

try {
  writeFileSync(join(carpeta, "sumar.test.js"), suite);

  // Paso 1: rojo — la prueba existe y falla contra el esqueleto.
  writeFileSync(join(carpeta, "sumar.js"), rojo);
  const pasoRojo = spawnSync(process.execPath, ["--test", "sumar.test.js"], {
    cwd: carpeta,
    encoding: "utf8",
  });
  console.log("--- paso 1: rojo ---");
  console.log(notas(pasoRojo.stdout));
  console.log("código de salida:", pasoRojo.status);

  // Paso 2: verde — misma suite, implementación corregida.
  writeFileSync(join(carpeta, "sumar.js"), verde);
  const pasoVerde = spawnSync(process.execPath, ["--test", "sumar.test.js"], {
    cwd: carpeta,
    encoding: "utf8",
  });
  console.log("--- paso 2: verde ---");
  console.log(notas(pasoVerde.stdout));
  console.log("código de salida:", pasoVerde.status);

  const correcto = pasoRojo.status === 1 && pasoVerde.status === 0;
  console.log(correcto ? "ciclo completo: rojo (1) → verde (0)" : "ciclo roto: revisa los códigos");
  if (!correcto) process.exit(1);
} finally {
  rmSync(carpeta, { recursive: true, force: true });
}

/** Líneas de resumen del runner (tests/pass/fail), en estilo TAP (#) o spec (ℹ). */
function notas(salida) {
  return salida
    .split("\n")
    .filter((linea) => /^(#|ℹ) (tests|pass|fail) /.test(linea))
    .join("\n");
}
