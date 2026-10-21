// descuento.js — la implementación que la suite de l03 verifica
export function aplicarDescuento(precio, porcentaje) {
  if (typeof precio !== "number" || !Number.isFinite(precio)) {
    throw new TypeError("el precio debe ser un número finito");
  }
  if (porcentaje < 0 || porcentaje > 50) {
    throw new RangeError("el porcentaje debe estar entre 0 y 50");
  }
  const descuento = (precio * porcentaje) / 100;
  return Math.round((precio - descuento) * 100) / 100;
}
