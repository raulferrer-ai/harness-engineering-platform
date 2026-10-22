// Versión original del módulo de gastos (lo que había antes de la entrega).
// Bug real: suma.toFixed(2) devuelve un string, no un número.
export function total(gastos) {
  const suma = gastos.reduce((acumulado, gasto) => acumulado + gasto.importe, 0);
  return suma.toFixed(2);
}
