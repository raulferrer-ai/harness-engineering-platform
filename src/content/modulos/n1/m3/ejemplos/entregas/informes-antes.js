// Versión original del resumen de importes (lo que había antes de la entrega).
// Bug real: el top es solo el primer importe, no el máximo.
export function resumen(importes) {
  let total = 0;
  for (const importe of importes) total += importe;
  return {
    top: importes[0],
    media: importes.length === 0 ? 0 : total / importes.length,
  };
}
