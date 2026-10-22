// casos.js — funciones plausibles con fallo en el caso límite (f05–f07).
// Cada una parece correcta en el uso normal: falla en el borde.
// Se ejecutan desde deteccion.js con la entrada declarada en fallos.json.

// f05: redondea al euro entero y se queda con los céntimos en el bolsillo.
export function descuento(precio, pct) {
  return Math.round(precio * (1 - pct / 100));
}

// f06: sort() por defecto compara como texto: "2026-1..." va antes que "2026-9..."
// aunque el 9 de septiembre sea anterior al 5 de octubre.
export function ordenarFechas(fechas) {
  return [...fechas].sort();
}

// f07: sin acumulador inicial, reduce de una lista vacía lanza TypeError.
// El contrato del módulo dice: lista vacía → null.
export function media(valores) {
  return valores.reduce((a, b) => a + b) / valores.length;
}
