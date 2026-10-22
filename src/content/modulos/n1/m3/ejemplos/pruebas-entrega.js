// H15 (l02) — ejecuta la suite que acompaña a cada entrega y cuenta lo que
// pasa y lo que falla. La suite de la entrega es evidencia ejecutada, no prosa.
import { spawnSync } from "node:child_process";

export function ejecutarSuite(rutaFichero) {
  const resultado = spawnSync(process.execPath, ["--test", rutaFichero], {
    encoding: "utf8",
    timeout: 60_000,
  });
  const salida = resultado.stdout ?? "";
  const resumen = (clave) => {
    const coincidencias = [...salida.matchAll(new RegExp(`ℹ ${clave} (\\d+)`, "g"))];
    return Number(coincidencias.at(-1)?.[1] ?? 0);
  };
  return { status: resultado.status, pass: resumen("pass"), fail: resumen("fail") };
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const id of ["gastos", "informes", "fechas"]) {
    const suite = ejecutarSuite(`entregas/${id}.test.js`);
    const estado = suite.fail === 0 ? "suite en verde" : "suite en rojo";
    console.log(`${id}: pass ${suite.pass} · fail ${suite.fail} → ${estado}`);
  }
  console.log(
    "una suite en rojo devuelve la entrega; una suite en verde no cierra la revisión: faltan dependencias y casos límite",
  );
}
