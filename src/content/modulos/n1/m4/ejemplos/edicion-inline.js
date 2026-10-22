// H16 (l03) — la edición inline: el asistente propone un parche, tú lo
// aplicas y lo verificas. VS Code muestra el dif con Keep/Undo; aquí el
// veredicto lo da la suite: verde → Keep, rojo → Undo.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const dirProyecto = new URL("./sesiones/proyecto/", import.meta.url);

/** Versión previa: devuelve texto con toFixed y revienta con lista vacía. */
export const ANTES = `export function total(importes) {
  const suma = importes.reduce((acumulado, importe) => acumulado + importe, 0);
  return suma.toFixed(2);
}
`;

/** Parche correcto del asistente: guarda de lista vacía + redondeo numérico. */
export const PARCHE_BUENO = `export function total(importes) {
  if (importes.length === 0) return 0;
  const suma = importes.reduce((acumulado, importe) => acumulado + importe, 0);
  return Math.round(suma * 100) / 100;
}
`;

/** Parche roto: redondea bien pero su reduce sin valor inicial revienta con la lista vacía. */
export const PARCHE_ROTO = `export function total(importes) {
  const suma = importes.reduce((acumulado, importe) => acumulado + importe);
  return Math.round(suma * 100) / 100;
}
`;

function resumenRunner(salida) {
  const ultima = (clave) => {
    const coincidencias = [...salida.matchAll(new RegExp(`ℹ ${clave} (\\d+)`, "g"))];
    return Number(coincidencias.at(-1)?.[1] ?? 0);
  };
  return { pass: ultima("pass"), fail: ultima("fail") };
}

export function aplicarYVerificar(contenido) {
  const carpeta = mkdtempSync(join(tmpdir(), "inline-"));
  try {
    writeFileSync(join(carpeta, "total.js"), contenido);
    const prueba = readFileSync(new URL("./total.test.js", dirProyecto), "utf8");
    writeFileSync(join(carpeta, "total.test.js"), prueba);
    const resultado = spawnSync(process.execPath, ["--test", "total.test.js"], {
      cwd: carpeta,
      encoding: "utf8",
      timeout: 60_000,
    });
    return { status: resultado.status, ...resumenRunner(resultado.stdout ?? "") };
  } finally {
    rmSync(carpeta, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("propuesta de edición inline: reescribir total() con guarda y redondeo");
  const antes = aplicarYVerificar(ANTES);
  console.log(`suite antes del parche: pass ${antes.pass} · fail ${antes.fail}`);
  const despues = aplicarYVerificar(PARCHE_BUENO);
  console.log(`suite después del parche: pass ${despues.pass} · fail ${despues.fail}`);
  if (despues.status === 0) {
    console.log("✓ parche aplicado y verificado (Keep) — la sesión s2 del registro lo cubre");
  } else {
    console.error("✗ parche en rojo: no se aplica");
    process.exit(1);
  }
}
