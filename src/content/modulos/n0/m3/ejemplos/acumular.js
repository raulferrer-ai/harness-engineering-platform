// acumular.js — acumuladores con for...of y for clásico (lección l02)
export function sumaImportes(importes) {
  if (!Array.isArray(importes)) {
    throw new TypeError("sumaImportes espera una lista");
  }
  let total = 0;
  for (const importe of importes) {
    if (typeof importe !== "number" || Number.isNaN(importe)) {
      throw new TypeError("todos los importes deben ser números");
    }
    total += importe;
  }
  return total;
}

export function maximoImporte(importes) {
  if (!Array.isArray(importes)) {
    throw new TypeError("maximoImporte espera una lista");
  }
  if (importes.length === 0) {
    throw new RangeError("maximoImporte necesita al menos un importe");
  }
  let maximo = importes[0];
  for (let i = 1; i < importes.length; i++) {
    if (importes[i] > maximo) {
      maximo = importes[i];
    }
  }
  return maximo;
}
