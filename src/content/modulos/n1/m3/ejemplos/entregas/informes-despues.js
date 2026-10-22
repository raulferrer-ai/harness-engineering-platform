// Entrega: el top usa Math.max y la media se redondea a dos decimales.
// Bug real que la entrega no ve: con la lista vacía esto lanza TypeError.
export function resumen(importes) {
  const top = Math.max(...importes);
  const total = importes.reduce((acumulado, importe) => acumulado + importe, 0);
  return { top, media: Math.round((total / importes.length) * 100) / 100 };
}
