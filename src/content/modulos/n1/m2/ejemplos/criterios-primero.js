// criterios-primero.js — los criterios existen ANTES que el código del asistente (l03)
//
// Los criterios de aceptación son pruebas ejecutables (node:test): tú las
// escribes, el asistente entrega código que debe satisfacerlas. Este driver
// ejecuta la MISMA suite dos veces:
//   fase rojo  — contra un borrador plausible del asistente (falla);
//   fase verde — contra la entrega de referencia (pasa).
// Un borrador plausible-but-incompleto se detecta solo: los criterios no se
// discuten, se ejecutan (igual que los claims de m1/l05).
//
// Uso: node criterios-primero.js

import { spawnSync } from "node:child_process";

/** Ejecuta la suite de tarea-1 y devuelve sus recuentos de la fase indicada. */
function ejecutarSuite(extra) {
  const inicio = performance.now();
  const resultado = spawnSync(process.execPath, ["--test", "tareas/tarea-1.test.js"], {
    env: { ...process.env, ...extra },
    encoding: "utf8",
    timeout: 30_000,
  });
  const ms = Math.round(performance.now() - inicio);
  const ultimo = (etiqueta) => {
    const coincidencias = [...resultado.stdout.matchAll(new RegExp(`${etiqueta}\\s+(\\d+)`, "g"))];
    return Number(coincidencias.at(-1)?.[1] ?? 0);
  };
  const fallidas = resultado.stdout
    .split("\n")
    .filter((linea) => /^\s*✖|not ok/.test(linea))
    .map((linea) => linea.trim())
    .filter((linea) => !linea.includes("failing tests"))
    .filter((linea, indice, todas) => todas.indexOf(linea) === indice);
  return { pass: ultimo("pass"), fail: ultimo("fail"), fallidas, ms, status: resultado.status };
}

const rojo = ejecutarSuite({ BORRADOR: "1" });
console.log("fase rojo — criterios contra el borrador del asistente:");
console.log(`  pass ${rojo.pass} · fail ${rojo.fail} (${rojo.ms} ms)`);
for (const linea of rojo.fallidas.slice(0, 4)) console.log(`  ✗ ${linea}`);

const verde = ejecutarSuite({});
console.log("fase verde — mismos criterios contra la entrega de referencia:");
console.log(`  pass ${verde.pass} · fail ${verde.fail} (${verde.ms} ms)`);

const borradorRefutado = rojo.fail > 0;
const entregaVerificada = verde.fail === 0 && verde.pass >= 4;

if (borradorRefutado && entregaVerificada) {
  console.log(
    `criterios primero: borrador refutado en ${rojo.fail} criterios; entrega verificada en ${verde.pass}`,
  );
} else {
  console.error(
    `secuencia inesperada: rojo con ${rojo.fail} fallos, verde con ${verde.fail}`,
  );
  process.exit(1);
}
