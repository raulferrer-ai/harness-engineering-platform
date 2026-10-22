// fallos.js — librería compartida del módulo: la colección personal de fallos
// y sus detectores por tipo. Cada detector confirma (o no) un fallo declarado
// en fallos/fallos.json usando sólo la librería estándar: sin red, sin claves
// y sin salir de la terminal.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import * as casos from "./fallos/casos.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));
export const RUTA_COLECCION = join(DIR_EJEMPLOS, "fallos", "fallos.json");
export const DIR_PROYECTO = join(DIR_EJEMPLOS, "proyecto");

/** Singular o plural según la cantidad: «1 fallo», «10 fallos». */
export function plural(cantidad, singular, enPlural) {
  return cantidad === 1 ? `1 ${singular}` : `${cantidad} ${enPlural}`;
}

/** Lee y valida la colección: al menos una entrada con id, tipo y titulo. */
export function leerColeccion(ruta = RUTA_COLECCION) {
  const datos = JSON.parse(readFileSync(ruta, "utf8"));
  if (!Array.isArray(datos.fallos) || datos.fallos.length === 0) {
    throw new Error(`${ruta} no declara ningún fallo (falta «fallos» con al menos una entrada)`);
  }
  for (const fallo of datos.fallos) {
    for (const campo of ["id", "tipo", "titulo"]) {
      if (typeof fallo[campo] !== "string" || fallo[campo] === "") {
        throw new Error(`${ruta}: falta «${campo}» en la entrada ${JSON.stringify(fallo)}`);
      }
    }
  }
  return datos;
}

/** Llamada legible de una comprobación: `descuento(19.99, 10)`. */
function llamada(funcion, entrada) {
  return `${funcion}(${entrada.map((argumento) => representar(argumento)).join(", ")})`;
}

/** Valor legible y fiel: JSON.stringify(-Infinity) es «null», así que los
 * números no finitos (NaN, ±Infinity) se muestran tal cual son. */
function representar(valor) {
  if (typeof valor === "number" && !Number.isFinite(valor)) {
    return String(valor);
  }
  return JSON.stringify(valor) ?? String(valor);
}

// Detectores por tipo de fallo. Reciben la comprobación declarada (y el
// contexto opcional) y devuelven { ok, detalle }: ok=true significa que la
// comprobación confirma el fallo; ok=false, que el fallo ya no aplica.
export const DETECTORES = {
  // Verifica el símbolo propuesto contra la librería estándar, sin salir de
  // la terminal: si no está exportado, la API no existe.
  "api-inexistente": async ({ modulo, simbolo, real }) => {
    const moduloReal = await import(modulo);
    const existe = typeof moduloReal[simbolo] !== "undefined";
    return existe
      ? { ok: false, detalle: `${modulo} sí exporta ${simbolo}: esta entrada ya no es un fallo` }
      : { ok: true, detalle: `${modulo} no exporta ${simbolo} — la que existe es ${real}` };
  },

  // Ejecuta la función con la entrada del caso límite y compara con lo
  // esperado: una discrepancia (o una excepción) confirma el fallo.
  "codigo-erroneo": ({ funcion, entrada, esperado }) => {
    const fn = casos[funcion];
    if (typeof fn !== "function") {
      return { ok: false, detalle: `fallos/casos.js no exporta ${funcion}` };
    }
    const prueba = llamada(funcion, entrada);
    let obtenido;
    try {
      obtenido = fn(...entrada);
    } catch (error) {
      return {
        ok: true,
        detalle: `${prueba} lanza ${error.constructor.name}: el caso pedía ${representar(esperado)}`,
      };
    }
    if (isDeepStrictEqual(obtenido, esperado)) {
      return { ok: false, detalle: `${prueba} devuelve ${representar(esperado)}: ese caso ya no falla` };
    }
    return {
      ok: true,
      detalle: `${prueba} devuelve ${representar(obtenido)}, el caso pedía ${representar(esperado)}`,
    };
  },

  // Comprueba que el paquete está declarado en package.json pero ausente del
  // package-lock.json: nadie lo ha instalado nunca porque no está publicado.
  "dependencia-inventada": ({ paquete }, { dirProyecto = DIR_PROYECTO } = {}) => {
    const manifiesto = JSON.parse(readFileSync(join(dirProyecto, "package.json"), "utf8"));
    const bloqueo = JSON.parse(readFileSync(join(dirProyecto, "package-lock.json"), "utf8"));
    if (typeof (manifiesto.dependencies ?? {})[paquete] !== "string") {
      return { ok: false, detalle: `${paquete} ya no está declarada en package.json` };
    }
    const resuelta = bloqueo.packages?.[`node_modules/${paquete}`];
    return resuelta
      ? { ok: false, detalle: `${paquete} está resuelta en el lock: es una dependencia real` }
      : { ok: true, detalle: `${paquete} declarada en package.json, ausente del lock — inventada` };
  },
};

/** Ejecuta todos los detectores de la colección y devuelve el resultado. */
export async function detectarColeccion(ruta = RUTA_COLECCION, contexto = {}) {
  const { fallos } = leerColeccion(ruta);
  const lineas = [];
  const incidencias = [];
  let detectados = 0;
  for (const fallo of fallos) {
    if (!fallo.comprobacion) {
      incidencias.push(`${fallo.id}: fallo declarado sin comprobación — «${fallo.titulo}» sólo existe en papel`);
      continue;
    }
    const detector = DETECTORES[fallo.tipo];
    if (!detector) {
      incidencias.push(`${fallo.id}: tipo «${fallo.tipo}» sin detector — «${fallo.titulo}» no es comprobable`);
      continue;
    }
    const { ok, detalle } = await detector(fallo.comprobacion, contexto);
    if (!ok) {
      incidencias.push(`${fallo.id}: la comprobación no confirma el fallo — ${detalle}`);
      continue;
    }
    detectados += 1;
    lineas.push(` ✓ ${fallo.id} — ${fallo.tipo} — ${detalle}`);
  }
  return { total: fallos.length, detectados, incidencias, lineas };
}
