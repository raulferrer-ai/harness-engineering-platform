/** Suma de una lista de importes enteros (céntimos). */
export function total(importes) {
  if (!Array.isArray(importes)) {
    throw new Error("total: se esperaba una lista");
  }
  return importes.reduce((acumulado, importe) => {
    if (!Number.isInteger(importe)) {
      throw new Error(`total: importe no entero → ${importe}`);
    }
    return acumulado + importe;
  }, 0);
}
