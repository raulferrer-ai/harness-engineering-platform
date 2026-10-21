// src/gastos.js — módulo 1 del proyecto: leer y validar el CSV (lección l07)
import { existsSync, readFileSync } from "node:fs";

/**
 * Convierte el contenido de un CSV en registros validados.
 * Cada fila malformada lanza con su número de línea.
 */
export function parseGastos(contenido) {
  if (typeof contenido !== "string") {
    throw new TypeError("parseGastos espera el contenido del fichero como texto");
  }
  const lineas = contenido.trim().split("\n").slice(1); // la primera es la cabecera
  const gastos = [];
  lineas.forEach((linea, indice) => {
    const limpio = linea.trim();
    if (limpio === "") {
      return;
    }
    const [fecha, descripcion, categoria, importe] = limpio.split(",");
    if (!fecha || !descripcion || !categoria || importe === undefined) {
      throw new TypeError(`línea ${indice + 2}: faltan campos («${limpio}»)`);
    }
    const valor = Number(importe);
    if (Number.isNaN(valor) || valor < 0) {
      throw new RangeError(`línea ${indice + 2}: importe inválido («${importe}»)`);
    }
    gastos.push({ fecha, descripcion, categoria, importe: valor });
  });
  return gastos;
}

/**
 * Lee y parsea un CSV. Acepta texto o URL: una URL relativa a `import.meta.url`
 * no depende de la carpeta desde la que se ejecute el programa.
 */
export function leerGastos(ruta) {
  const esRutaValida = typeof ruta === "string" ? ruta.trim() !== "" : ruta instanceof URL;
  if (!esRutaValida) {
    throw new TypeError("leerGastos espera la ruta (texto o URL) de un fichero");
  }
  if (!existsSync(ruta)) {
    throw new Error(`no existe el fichero: ${ruta}`);
  }
  return parseGastos(readFileSync(ruta, "utf8"));
}
