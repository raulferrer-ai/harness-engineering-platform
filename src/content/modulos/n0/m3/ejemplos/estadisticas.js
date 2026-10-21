// estadisticas.js — map, filter y reduce sobre la lista de gastos (lección l04)
export function importesDe(gastos) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("importesDe espera una lista de gastos");
  }
  return gastos.map((gasto) => gasto.importe);
}

export function filtrarPorCategoria(gastos, categoria) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("filtrarPorCategoria espera una lista de gastos");
  }
  if (typeof categoria !== "string") {
    throw new TypeError("filtrarPorCategoria espera una categoría (texto)");
  }
  return gastos.filter((gasto) => gasto.categoria === categoria);
}

export function totalImportes(importes) {
  if (!Array.isArray(importes)) {
    throw new TypeError("totalImportes espera una lista de importes");
  }
  return importes.reduce((acumulado, importe) => acumulado + importe, 0);
}

export function mediaImportes(importes) {
  if (!Array.isArray(importes)) {
    throw new TypeError("mediaImportes espera una lista de importes");
  }
  if (importes.length === 0) {
    throw new RangeError("mediaImportes necesita al menos un importe");
  }
  return totalImportes(importes) / importes.length;
}
