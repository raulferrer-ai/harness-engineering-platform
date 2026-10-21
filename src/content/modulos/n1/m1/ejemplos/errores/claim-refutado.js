// claim-refutado.js — una afirmación del asistente que NO sobrevive la prueba (l05, rojo)
// Termina en rojo a propósito: el claim «parsearFilas valida el número de
// columnas» se traduce a una condición ejecutable y la condición no se cumple.
// Uso: node claim-refutado.js (devuelve código 1).

function parsearFilas(texto) {
  return texto
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l) => l.split(","));
}

const claim = "«parsearFilas valida el número de columnas»";

// Condición verificable derivada del claim.
const filas = parsearFilas("a,1\nb"); // la segunda fila solo tiene 1 columna
const cumple = filas.every((f) => f.length === 2);

if (!cumple) {
  console.error(`REFUTADO — ${claim}`);
  console.error(`   detalle: se esperaban 2 columnas en todas las filas, hay: ${JSON.stringify(filas)}`);
  console.error("   el asistente afirmó algo que la ejecución contradice.");
  process.exit(1);
}

console.log(`VERIFICADO — ${claim}`);
