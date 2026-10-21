// src/informe.js — módulo 2 del proyecto: agregados y formato (lección l07)

function importeEnEuros(valor) {
  return `${valor.toFixed(2)} EUR`;
}

/** Genera el informe de gastos como texto de diez líneas. */
export function generarInforme(gastos) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("generarInforme espera la lista de gastos");
  }
  if (gastos.length === 0) {
    throw new RangeError("generarInforme: la lista de gastos está vacía");
  }

  const total = gastos.reduce((suma, gasto) => suma + gasto.importe, 0);
  const maximo = gastos.reduce((mayor, gasto) => (gasto.importe > mayor.importe ? gasto : mayor));

  const porCategoria = new Map();
  for (const gasto of gastos) {
    const actual = porCategoria.get(gasto.categoria) ?? { recuentos: 0, total: 0 };
    porCategoria.set(gasto.categoria, {
      recuentos: actual.recuentos + 1,
      total: actual.total + gasto.importe,
    });
  }

  const lineas = [
    "Informe de gastos",
    `gastos: ${gastos.length}`,
    `total: ${importeEnEuros(total)}`,
    `media: ${importeEnEuros(total / gastos.length)}`,
    `máximo: ${importeEnEuros(maximo.importe)}`,
    "por categoría:",
  ];
  for (const categoria of [...porCategoria.keys()].sort()) {
    const dato = porCategoria.get(categoria);
    lineas.push(`  ${categoria}: ${dato.recuentos} gasto(s), ${importeEnEuros(dato.total)}`);
  }
  return lineas.join("\n");
}
