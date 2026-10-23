// Librería de refactor asistido: métricas heurísticas, suite y certificación.
// Solo librería estándar: se ejecuta sin red y sin dependencias.
//
// Las métricas son heurísticas sobre el texto del módulo (no un parser):
// sirven para comparar el antes y el después de un refactor, no para juzgar
// el estilo de un archivo de forma universal. Cada una documenta qué cuenta.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Líneas que miden: ni vacías, ni comentarios, ni solo signos de llaves.
function lineasDeCodigo(texto) {
  return texto
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => linea !== "")
    .filter((linea) => !linea.startsWith("//"))
    .filter((linea) => !/^[{}()[\];,]*$/.test(linea));
}

// Funciones declaradas con `function nombre(...)`: mide sus líneas contando
// llaves. No sigue funciones de flecha asignadas a constantes.
function lineasPorFuncion(texto) {
  const funciones = [];
  let actual = null;
  let profundidad = 0;
  for (const linea of texto.split("\n")) {
    const comienzo = linea.match(/^(?:export\s+)?function\s+(\w+)/);
    if (comienzo && actual === null) {
      actual = { nombre: comienzo[1], lineas: 0 };
      profundidad = 0;
    }
    if (actual) {
      actual.lineas += 1;
      profundidad += (linea.match(/\{/g) ?? []).length - (linea.match(/\}/g) ?? []).length;
      if (profundidad === 0 && /\}/.test(linea)) {
        funciones.push(actual);
        actual = null;
      }
    }
  }
  return funciones;
}

// Números mágicos: literales numéricos (distintos de 0 y 1) en líneas que
// no declaran una constante en mayúsculas. Es el olor concreto de «cifra sin
// nombre incrustada en la lógica».
function contarMagicos(texto) {
  let cuenta = 0;
  for (const linea of texto.split("\n")) {
    const limpia = linea.trim();
    if (limpia === "" || limpia.startsWith("//")) continue;
    if (/\b[A-Z][A-Z0-9_]*\s*=/.test(limpia)) continue;
    for (const literal of limpia.match(/\b\d+(?:\.\d+)?\b/g) ?? []) {
      if (literal !== "0" && literal !== "1") cuenta += 1;
    }
  }
  return cuenta;
}

// Profundidad máxima de llaves anidadas (ignorando comentarios).
function profundidadMaxima(texto) {
  let actual = 0;
  let maxima = 0;
  for (const linea of texto.split("\n")) {
    const limpia = linea.trim();
    if (limpia === "" || limpia.startsWith("//")) continue;
    actual += (linea.match(/\{/g) ?? []).length - (linea.match(/\}/g) ?? []).length;
    maxima = Math.max(maxima, actual);
  }
  return maxima;
}

// Líneas de código que se repiten (cada ocurrencia de una línea normalizada
// que aparece dos o más veces cuenta).
function lineasDuplicadas(texto) {
  const conteo = new Map();
  for (const linea of lineasDeCodigo(texto)) {
    const clave = linea.replace(/\s+/g, " ");
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  }
  let duplicadas = 0;
  for (const cuenta of conteo.values()) {
    if (cuenta > 1) duplicadas += cuenta;
  }
  return duplicadas;
}

/** Mide un módulo JS y devuelve sus métricas de refactor. */
export function medir(ruta) {
  const texto = readFileSync(ruta, "utf8");
  const funciones = lineasPorFuncion(texto);
  return {
    lineas: lineasDeCodigo(texto).length,
    funcionMasLarga: Math.max(...funciones.map((f) => f.lineas), 0),
    numerosMagicos: contarMagicos(texto),
    anidamientoMax: profundidadMaxima(texto),
    lineasDuplicadas: lineasDuplicadas(texto),
  };
}

/** Compara dos juegos de métricas: qué baja, qué sube y si hay mejora neta. */
export function comparar(antes, despues) {
  const deltas = {};
  for (const clave of Object.keys(antes)) {
    deltas[clave] = despues[clave] - antes[clave];
  }
  const mejoran = Object.keys(deltas).filter((clave) => deltas[clave] < 0);
  const empeoran = Object.keys(deltas).filter((clave) => deltas[clave] > 0);
  return { deltas, mejoran, empeoran, mejora: mejoran.length > 0 && empeoran.length === 0 };
}

/** Corre la suite `node --test` de un directorio y resume el resultado. */
export function correrSuite(directorio) {
  const corrida = spawnSync(process.execPath, ["--test"], {
    cwd: directorio,
    encoding: "utf8",
    timeout: 60_000,
  });
  const salida = `${corrida.stdout ?? ""}${corrida.stderr ?? ""}`;
  const leer = (etiqueta) => Number(salida.match(new RegExp(`^ℹ ${etiqueta} (\\d+)`, "m"))?.[1] ?? 0);
  return {
    status: corrida.status,
    pruebas: leer("tests"),
    verdes: leer("pass"),
    fallos: leer("fail"),
  };
}

/** ¿Siguen siendo los mismos exports los dos ficheros? (contrato de API) */
export function mismosExports(rutaA, rutaB) {
  const nombres = (ruta) =>
    [...readFileSync(ruta, "utf8").matchAll(/export\s+(?:function|const|let|var)\s+(\w+)/g)]
      .map((m) => m[1])
      .sort();
  return JSON.stringify(nombres(rutaA)) === JSON.stringify(nombres(rutaB));
}

// Métricas que puntúan el veredicto: las de olor. `lineas` se reporta pero
// no puntúa — extraer funciones suele (y debe) poder añadir líneas.
export const OLOR = ["funcionMasLarga", "numerosMagicos", "anidamientoMax", "lineasDuplicadas"];

/**
 * Certifica un refactor sin regresiones. Tres condiciones:
 * 1) la suite del proyecto está verde,
 * 2) la API no cambió (mismos exports que el original),
 * 3) las métricas de olor mejoran sin que ninguna empeore.
 */
export function certificar({ original, refactorizado, suite, metricasAntes }) {
  const incidencias = [];
  const corrida = correrSuite(suite);
  if (corrida.status !== 0) {
    incidencias.push(`suite en rojo: ${corrida.fallos} fallos de ${corrida.pruebas}`);
  }
  if (!mismosExports(original, refactorizado)) {
    incidencias.push("la API cambió: los exports ya no son los mismos");
  }
  const antes = Object.fromEntries(OLOR.map((clave) => [clave, metricasAntes[clave]]));
  const despues = Object.fromEntries(OLOR.map((clave) => [clave, medir(refactorizado)[clave]]));
  const veredicto = comparar(antes, despues);
  if (veredicto.empeoran.length > 0) {
    incidencias.push(`métricas empeoradas: ${veredicto.empeoran.join(", ")}`);
  }
  if (veredicto.mejoran.length === 0) {
    incidencias.push("ninguna métrica de olor mejora");
  }
  return { despues: medir(refactorizado), veredicto, corrida, incidencias, valido: incidencias.length === 0 };
}
