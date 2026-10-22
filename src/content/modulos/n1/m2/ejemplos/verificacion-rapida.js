// verificacion-rapida.js — comprobar la entrega entera en menos de 10 minutos (l05)
//
// Una tarea solo es pequeña si su verificación también lo es: un comando,
// criterios ejecutables y unos milisegundos de ejecución. Este script toma la
// serie de serie.js, ejecuta el comando de verificación de cada tarea con
// node --test y mide el tiempo REAL de cada ejecución. Un borrador que dice
// «hecho» no es evidencia: evidencia es la suite en verde y medida (el coding
// de OpenAI avisa de que las herramientas devuelven «Done» incluso al fallar).
//
// Uso: node verificacion-rapida.js

import { spawnSync } from "node:child_process";
import { serie } from "./serie.js";

const LIMITE_MS = 10 * 60 * 1000; // 10 minutos: la regla del curso

/** Ejecuta el comando de verificación de una tarea y mide su duración real. */
export function medirVerificacion(comando) {
  const [binario, ...argumentos] = comando.split(" ");
  const inicio = performance.now();
  const resultado = spawnSync(binario, argumentos, { encoding: "utf8", timeout: 60_000 });
  const ms = Math.round(performance.now() - inicio);
  const ultimo = (etiqueta) => {
    const coincidencias = [...resultado.stdout.matchAll(new RegExp(`${etiqueta}\\s+(\\d+)`, "g"))];
    return Number(coincidencias.at(-1)?.[1] ?? 0);
  };
  return { pass: ultimo("pass"), fail: ultimo("fail"), ms, status: resultado.status };
}

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("verificacion-rapida.js")) {
  let totalMs = 0;
  let todoVerde = true;
  let dentroDelLimite = true;

  for (const tarea of serie) {
    const medicion = medirVerificacion(tarea.verificacion);
    totalMs += medicion.ms;
    const verde = medicion.fail === 0 && medicion.status === 0;
    const rapido = medicion.ms < LIMITE_MS;
    todoVerde &&= verde;
    dentroDelLimite &&= rapido;
    console.log(
      `${verde ? "✓" : "✗"} ${tarea.id}: ${tarea.verificacion} → ${medicion.pass} pruebas en verde en ${medicion.ms} ms${rapido ? "" : " (SUPERA EL LÍMITE)"}`,
    );
  }

  console.log(`verificación total: ${totalMs} ms (límite: ${LIMITE_MS} ms = 10 minutos)`);
  if (todoVerde && dentroDelLimite) {
    console.log(`${serie.length} tareas verificables en mucho menos de 10 minutos`);
  } else {
    console.error("serie no verificable dentro del límite de 10 minutos");
    process.exit(1);
  }
}
