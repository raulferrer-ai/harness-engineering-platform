// entregable-rojo-verde.js — el entregable del módulo: la suite falla a propósito y luego pasa (l07)
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const carpeta = mkdtempSync(join(tmpdir(), "entregable-"));

const correcta = readFileSync(join(aqui, "presupuesto.js"), "utf8");
const suite = readFileSync(join(aqui, "presupuesto.test.js"), "utf8");
// Versión con el bug de frontera: cobra envío también en 50 € (omite el >=).
const conBug = correcta.replace("base >= envioGratisDesde", "base > envioGratisDesde");

try {
  writeFileSync(join(carpeta, "presupuesto.test.js"), suite);

  writeFileSync(join(carpeta, "presupuesto.js"), conBug);
  const rojo = spawnSync(process.execPath, ["--test", "presupuesto.test.js"], {
    cwd: carpeta,
    encoding: "utf8",
  });
  console.log("--- rojo a propósito (versión con el bug de frontera) ---");
  console.log(resumen(rojo.stdout));
  console.log("código de salida:", rojo.status);

  writeFileSync(join(carpeta, "presupuesto.js"), correcta);
  const verde = spawnSync(process.execPath, ["--test", "presupuesto.test.js"], {
    cwd: carpeta,
    encoding: "utf8",
  });
  console.log("--- verde (versión corregida, misma suite) ---");
  console.log(resumen(verde.stdout));
  console.log("código de salida:", verde.status);

  const entregable = rojo.status === 1 && verde.status === 0;
  console.log(
    entregable
      ? "entregable válido: la misma suite cae en rojo (1) con el bug y termina en verde (0) sin él"
      : "entregable inválido: revisa los códigos de salida",
  );
  if (!entregable) process.exit(1);
} finally {
  rmSync(carpeta, { recursive: true, force: true });
}

/** Líneas de resumen del runner (tests/pass/fail), en estilo TAP (#) o spec (ℹ). */
function resumen(salida) {
  return salida
    .split("\n")
    .filter((linea) => /^(#|ℹ) (tests|pass|fail) /.test(linea))
    .join("\n");
}
