// gastos.js — crear, ampliar y consultar listas sin mutarlas (lección l03)
export function crearGasto(descripcion, categoria, importe) {
  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    throw new TypeError("crearGasto espera una descripción no vacía");
  }
  if (typeof categoria !== "string" || categoria.trim() === "") {
    throw new TypeError("crearGasto espera una categoría no vacía");
  }
  if (typeof importe !== "number" || Number.isNaN(importe) || importe < 0) {
    throw new TypeError("crearGasto espera un importe numérico no negativo");
  }
  return Object.freeze({ descripcion: descripcion.trim(), categoria: categoria.trim(), importe });
}

export function agregarGasto(gastos, gasto) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("agregarGasto espera una lista de gastos");
  }
  if (gasto === null || typeof gasto !== "object" || !("importe" in gasto)) {
    throw new TypeError("agregarGasto espera un gasto con sus campos");
  }
  return [...gastos, gasto];
}

export function gastoEn(gastos, posicion) {
  if (!Array.isArray(gastos)) {
    throw new TypeError("gastoEn espera una lista de gastos");
  }
  if (!Number.isInteger(posicion) || posicion < 0 || posicion >= gastos.length) {
    throw new RangeError(`posición ${posicion} fuera de la lista (0…${gastos.length - 1})`);
  }
  return gastos[posicion];
}
