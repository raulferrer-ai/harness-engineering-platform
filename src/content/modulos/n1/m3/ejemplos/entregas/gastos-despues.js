// Entrega: el total ahora devuelve un número redondeado a dos decimales.
export function total(gastos) {
  const suma = gastos.reduce((acumulado, gasto) => acumulado + gasto.importe, 0);
  return Math.round(suma * 100) / 100;
}
