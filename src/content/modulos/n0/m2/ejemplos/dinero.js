// dinero.js — trabajar con euros en céntimos enteros (lección l04)
export function eurosACents(euros) {
  if (typeof euros !== "number" || Number.isNaN(euros)) {
    throw new TypeError("eurosACents espera un número");
  }
  if (euros < 0) {
    throw new RangeError("eurosACents no acepta negativos");
  }
  return Math.round(euros * 100);
}

export function centsAEuros(cents) {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new RangeError("centsAEuros espera céntimos enteros no negativos");
  }
  return cents / 100;
}
