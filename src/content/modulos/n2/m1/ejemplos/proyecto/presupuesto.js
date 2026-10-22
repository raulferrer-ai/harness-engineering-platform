// presupuesto.js — implementación del contrato de spec.md.
// Cada línea: base = importe − descuento; con impuesto sobre la base; el
// total de la factura se redondea a dos decimales con Math.round estándar.
export function totalFactura(lineas) {
  let total = 0;
  for (const { importe, impuesto = 0, descuento = 0 } of lineas) {
    const base = importe - (importe * descuento) / 100;
    total += (base * (100 + impuesto)) / 100;
  }
  return Math.round(total * 100) / 100;
}
