// convertir.js — módulo que solo exporta utilidades de formato (lección l01)
// Un módulo es un fichero con exports: al importarlo no imprime nada ni hace
// efectos; quien lo importa decide cuándo llamar a sus funciones.

export const EUR = "EUR";

export function importeEnEuros(valor) {
  if (typeof valor !== "number" || Number.isNaN(valor)) {
    throw new TypeError(`importeEnEuros espera un número, recibió ${typeof valor}`);
  }
  return `${valor.toFixed(2)} ${EUR}`;
}
