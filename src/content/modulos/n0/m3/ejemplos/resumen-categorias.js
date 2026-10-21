// resumen-categorias.js — conteos con objeto-diccionario y únicos con Set (lección l05)
export function cuentaPorCategoria(gastos) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("cuentaPorCategoria espera una lista de gastos");
  }
  const cuentas = {};
  for (const gasto of gastos) {
    if (Object.hasOwn(cuentas, gasto.categoria)) {
      cuentas[gasto.categoria] = cuentas[gasto.categoria] + 1;
    } else {
      cuentas[gasto.categoria] = 1;
    }
  }
  return cuentas;
}

export function categoriasUnicas(gastos) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("categoriasUnicas espera una lista de gastos");
  }
  const unicas = new Set();
  for (const gasto of gastos) {
    unicas.add(gasto.categoria);
  }
  return [...unicas].sort();
}

export function importesPorCategoria(gastos) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("importesPorCategoria espera una lista de gastos");
  }
  const acumulados = new Map();
  for (const gasto of gastos) {
    const previo = acumulados.get(gasto.categoria) ?? 0;
    acumulados.set(gasto.categoria, previo + gasto.importe);
  }
  return acumulados;
}
