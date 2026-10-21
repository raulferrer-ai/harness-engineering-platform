// comprobar-claim.js — separar el enunciado verificable de la prosa (l05)
//
// Un "claim" (afirmación) del modelo se vuelve útil cuando lo conviertes en algo
// que se puede comprobar: una condición sobre el código, un comando, una salida.
// Este script toma afirmaciones típicas de un asistente y las separa en:
//   - lo afirma (prosa, no verificable por sí sola),
//   - lo verificable (expresión/condición ejecutable),
//   y ejecuta la comprobación para ver si se cumple o no.
//
// Uso: node comprobar-claim.js

/** Afirma y verifica: ejecuta la condición y reporta si se cumple. */
function comprobar(afirmacion, condicion) {
  let cumple;
  let detalle;
  try {
    cumple = Boolean(condicion());
    detalle = cumple ? "la condición se cumple" : "la condición NO se cumple";
  } catch (error) {
    cumple = false;
    detalle = `la condición lanza ${error.constructor.name}: ${error.message}`;
  }
  return { afirmacion, cumple, detalle };
}

const claims = [
  {
    afirmacion: "«parsearFilas devuelve siempre un array»",
    condicion: () => {
      const filas = parsearFilas("a,1\nb,2");
      if (!Array.isArray(filas)) throw new TypeError("no es un array");
      return filas.length === 2;
    },
  },
  {
    afirmacion: "«parsearFilas ignora las líneas vacías»",
    condicion: () => parsearFilas("a,1\n\n\nb,2").length === 2,
  },
  {
    afirmacion: "«parsearFilas valida el número de columnas»",
    condicion: () => {
      const filas = parsearFilas("a,1\nb"); // fila incompleta
      return filas.every((f) => f.length === 2);
    },
  },
];

// Implementación de juguete bajo prueba (a propósito, con el fallo del claim 3).
function parsearFilas(texto) {
  return texto
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l) => l.split(","));
}

console.log("afirmaciones del asistente, convertidas en comprobaciones:\n");
for (const c of claims) {
  const r = comprobar(c.afirmacion, c.condicion);
  console.log(`${r.cumple ? "VERIFICADO" : "REFUTADO"} — ${r.afirmacion}`);
  console.log(`   ${r.detalle}`);
}
console.log("\n--- lectura ---");
console.log("La prosa del modelo no se puede refutar; la condición sí.");
console.log("Cada claim útil debe poder traducirse a una condición ejecutable.");
console.log("Si no puedes traducirlo, o es una opinión, o no está verificado.");
console.log("\nLección práctica: pide afirmaciones comprobables y ejecútalas.");
