// leer-gastos.js — leer y parsear un CSV real de gastos (lección l06)
import { existsSync, readFileSync } from "node:fs";

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

export function leerGastos(ruta) {
  if (typeof ruta !== "string" || ruta.trim() === "") {
    throw new TypeError("leerGastos espera la ruta de un fichero");
  }
  if (!existsSync(ruta)) {
    throw new Error(`no existe el fichero: ${ruta}`);
  }
  return parseGastos(readFileSync(ruta, "utf8"));
}
