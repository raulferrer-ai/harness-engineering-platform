// dividir.js — contrato explícito: valida la entrada y los errores de dominio (lección l05)
export function dividir(dividendo, divisor) {
  if (typeof dividendo !== "number" || typeof divisor !== "number") {
    throw new TypeError("dividir espera dos números");
  }
  if (Number.isNaN(dividendo) || Number.isNaN(divisor)) {
    throw new TypeError("dividir no acepta NaN");
  }
  if (divisor === 0) {
    throw new RangeError("dividir no puede dividir entre cero");
  }
  return dividendo / divisor;
}
