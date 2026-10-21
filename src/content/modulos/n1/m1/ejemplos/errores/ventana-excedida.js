// ventana-excedida.js — mandar más contexto del que la ventana admite (l03, rojo)
// Termina en rojo a propósito: igual que un proveedor real, la "ventana" rechaza
// la petición cuando el número de tokens la supera, en lugar de truncar en silencio.
// Uso: node ventana-excedida.js (devuelve código 1).

import { tokenizar } from "../tokenizar.js";

// Ventana de juguete, pequeña para poder excederla con un texto modesto.
const VENTANA = 400;

const contexto = "Revisa el módulo de informes y valida cada fila del CSV. ".repeat(60);
const tokens = tokenizar(contexto).length;

console.log("tokens del contexto:", tokens);
console.log("ventana admitida:", VENTANA);

if (tokens > VENTANA) {
  console.error(`Error: el contexto excede la ventana (${tokens} > ${VENTANA}).`);
  console.error("La petición se rechaza: no se procesa parcialmente ni se 'recuerda'.");
  process.exit(1);
}

console.log("cabe en la ventana; la petición se procesaría.");
