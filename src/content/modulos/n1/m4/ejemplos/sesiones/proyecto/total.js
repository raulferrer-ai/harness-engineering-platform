// Estado final del proyecto tras las sesiones s2 y s4 del registro:
// devuelve número redondeado y cubre la lista vacía.
export function total(importes) {
  if (importes.length === 0) return 0;
  const suma = importes.reduce((acumulado, importe) => acumulado + importe, 0);
  return Math.round(suma * 100) / 100;
}
