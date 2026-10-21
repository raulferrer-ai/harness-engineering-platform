// coste-contexto.js — el contexto no solo es finito, también tiene COSTE (l03)
//
// Los proveedores facturan por token (entrada y salida), no por carácter.
// Este script calcula el coste de mandar un mismo contexto con precios de
// referencia y muestra dos consecuencias prácticas:
//   1. el coste crece con los tokens, no con las líneas de código;
//   2. reenviar el historial completo en cada turno multiplica la factura.
//
// Precios de referencia (USD por millón de tokens) tomados de la página de
// precios de OpenAI (fecha de consulta 2026-10-21). Los valores exactos
// cambian con el tiempo y entre proveedores; el modelo de cálculo, no.
//
// Uso: node coste-contexto.js

import { tokenizar } from "./tokenizar.js";

// Precios de referencia: entrada (input) y salida (output) por 1M tokens.
const PRECIO = { entrada: 1.25, salida: 10 };

const mensaje =
  "Revisa este módulo de Node.js y explica si valida la entrada del CSV. ".repeat(50);
const respuesta =
  "El módulo no valida filas vacías ni el número de columnas; lanza un error genérico. ".repeat(20);

const tEntrada = tokenizar(mensaje).length;
const tSalida = tokenizar(respuesta).length;

const costeEntrada = (tEntrada / 1_000_000) * PRECIO.entrada;
const costeSalida = (tSalida / 1_000_000) * PRECIO.salida;

console.log("precios de referencia (USD por 1M tokens):", JSON.stringify(PRECIO));
console.log("mensaje:", tEntrada, "tokens de entrada");
console.log("respuesta:", tSalida, "tokens de salida");
console.log(
  "coste de esta llamada: $",
  (costeEntrada + costeSalida).toFixed(6),
  `(entrada $${costeEntrada.toFixed(6)} + salida $${costeSalida.toFixed(6)})`,
);

//-turno a turno: reenviar el historial crece en cuadrado (O(n²) sobre turnos).
console.log("\n--- conversación de 8 turnos con historial reenviado ---");
let acumulado = 0;
for (let turno = 1; turno <= 8; turno++) {
  // Cada turno reenvía todos los anteriores + el nuevo mensaje + la respuesta.
  const entradaTurno = tEntrada * turno + tSalida * (turno - 1);
  const coste = (entradaTurno / 1_000_000) * PRECIO.entrada;
  acumulado += coste;
  console.log(
    `turno ${turno}: ${entradaTurno} tokens → $${coste.toFixed(6)} (acumulado $${acumulado.toFixed(6)})`,
  );
}

console.log("\nLección práctica: el contexto es un recurso con precio.");
console.log("Manda el mínimo necesario: el archivo relevante, no todo el repositorio.");
