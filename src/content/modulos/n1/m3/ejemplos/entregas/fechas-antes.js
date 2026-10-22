// Versión original de la detección de bisiestos (lo que había antes de la entrega).
// Bug real: solo mira el 4; los siglos (1900) salen falsos positivos.
export function esBisiesto(anio) {
  return anio % 4 === 0;
}
