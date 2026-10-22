// H15 — rojo de l01: una entrega cuyo código ni siquiera se carga.
// Falta cerrar la llave de la función: SyntaxError al importar.
export function total(gastos) {
  const suma = gastos.reduce((acumulado, gasto) => acumulado + gasto.importe, 0);
  if (suma !== 0) {
    console.log("hay importes");
  }
  return Math.round(suma * 100) / 100;
