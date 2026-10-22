// Entrega: la regla completa (4, 100 y 400). El código no usa ninguna dependencia.
export function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
}
