// ventana-contexto.js — la ventana de contexto: un límite FINITO de tokens (l03)
//
// Todo modelo tiene una ventana máxima de tokens (contexto). Lo que no cabe se
// pierde: el modelo no lo "recuerda", simplemente no lo ve. Este script usa el
// tokenizador de tokenizar.js para medir, con números reales, cuántas veces
// cabe una tarea en la ventana y qué pasa al excederla.
//
// Uso: node ventana-contexto.js

import { tokenizar } from "./tokenizar.js";

// Ventana real de referencia (fecha de consulta 2026-10-21). Los valores
// exactos cambian entre modelos; lo que NO cambia es que son FINITOS.
const VENTANAS = [
  { modelo: "ventana pequeña", tokens: 8_000 },
  { modelo: "ventana media", tokens: 32_000 },
  { modelo: "ventana grande", tokens: 128_000 },
];

// Un "módulo de código" de tamaño realista, para medir de verdad.
const contexto = `
Módulo de informe de gastos: leerGastos(ruta) parsea el CSV y valida filas,
lanzando un error con el número de línea. generarInforme(gastos) calcula
total, media, máximo y el desglose por categoría, y devuelve un texto de diez
líneas. El punto de entrada main.js comprueba el argumento, envuelve la
llamada y traduce cualquier error a un mensaje con código de salida 1.
Las pruebas de composición cruzan los tres módulos y deben pasar en verde.
`.repeat(4); // x4 para acercarnos a un tamaño de contexto real

const n = tokenizar(contexto).length;

console.log("tamaño del contexto medido:", n, "tokens\n");
console.log("¿cuántas veces cabe en cada ventana?");
for (const v of VENTANAS) {
  const cabe = n / v.tokens;
  const estado = cabe <= 1 ? "cabe entero" : "NO cabe: se trunca";
  console.log(`- ${v.modelo} (${v.tokens.toLocaleString("es")}): cabe ×${cabe.toFixed(2)} → ${estado}`);
}

// Caso de desbordamiento real: multiplicamos el contexto hasta exceder una
// ventana concreta y mostramos cuánto se pierde por la cola.
const VENTANA = 400; // ventana de juguete, pequeña, para que el cálculo se vea
const veces = Math.ceil(VENTANA / n) + 1;
const gigante = contexto.repeat(veces);
const total = tokenizar(gigante).length;
const seVe = Math.min(total, VENTANA);
const sePierde = total - seVe;

console.log(`\n--- desbordamiento en una ventana de ${VENTANA} tokens ---`);
console.log("contexto:", veces, "veces el módulo →", total, "tokens");
console.log("cabe en la ventana:", seVe, "tokens");
console.log("QUEDA FUERA (se pierde):", sePierde, "tokens");
console.log(`→ el modelo solo ve el ${((seVe / total) * 100).toFixed(1)}% del contexto.`);

console.log("\n--- qué significa el truncado ---");
console.log("Si el contexto excede la ventana, el excedente queda fuera del campo de");
console.log("visión del modelo. Por eso a veces 'olvida' instrucciones que estaban");
console.log("al principio: no las recuerda, no las está viendo.");
console.log("\nLección práctica: el contexto es un recurso FINITO y con coste; se administra.");
