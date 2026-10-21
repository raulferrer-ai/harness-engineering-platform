// sensibilidad-contexto.js — la misma pregunta, distinto contexto → distinta respuesta (l04)
//
// La respuesta del modelo depende de TODO lo que ve en la ventana: instrucciones,
// ejemplos, código cercano y orden. Cambiar el contexto (aunque la pregunta sea
// idéntica) cambia la respuesta. Este script lo demuestra de forma reproducible
// con un "modelo" de juguete determinista que puntúa cada opción según las
// pistas del contexto — sin red ni claves, para que el resultado sea verificable.
//
// Uso: node sensibilidad-contexto.js

/** Puntúa las opciones según qué tan bien encajan con las pistas del contexto. */
function responder(pregunta, contexto) {
  const opciones = {
    JSON: ["json", "parse", "serializ", "dato"],
    HTTP: ["http", "request", "api", "red", "fetch"],
    "fs/promises": ["archivo", "fichero", "lectura", "disco", "csv"],
  };
  const pistas = Object.entries(opciones).map(([nombre, claves]) => ({
    nombre,
    puntos: claves.filter((c) => contexto.toLowerCase().includes(c)).length,
  }));
  const ganador = pistas.sort((a, b) => b.puntos - a.puntos)[0];
  return { pregunta, respuesta: ganador.nombre, pistas };
}

const pregunta = "¿Qué módulo debo usar aquí?";

const contextoA = `
// Lee el fichero de datos desde disco y devuelve sus filas.
const lineas = await leer(ruta);
`;

const contextoB = `
// Envía la petición al servidor y devuelve la respuesta.
const res = await fetch(url);
`;

const contextoC = `
// Nota del equipo: en este repositorio todo lo que toca datos usa JSON.
// Conviene mantener el mismo criterio en el nuevo código.
`;

for (const [nombre, contexto] of [
  ["A (lee un archivo)", contextoA],
  ["B (hace una petición)", contextoB],
  ["C (sesgo del equipo: JSON)", contextoC],
]) {
  const r = responder(pregunta, contexto);
  console.log(`contexto ${nombre}`);
  console.log("  pregunta:", pregunta);
  console.log("  respuesta:", r.respuesta);
  console.log("  pistas que la sostienen:", JSON.stringify(r.pistas));
  console.log();
}

console.log("--- lectura ---");
console.log("La pregunta es idéntica en los tres casos; cambia solo el contexto.");
console.log("Por eso el orden y el contenido de la ventana influyen en la respuesta,");
console.log("y por qué instrucciones contradictorias producen respuestas incoherentes.");
console.log("\nLección práctica: controla el contexto que receives; no dejes que lo componga la casualidad.");
