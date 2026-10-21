// presupuesto.js — implementación correcta: IVA y mínimo de envío (lección l07)
export function totalPresupuesto(base, { iva = 21, envioGratisDesde = 50 } = {}) {
  if (typeof base !== "number" || !Number.isFinite(base) || base < 0) {
    throw new RangeError("la base del presupuesto debe ser un número no negativo");
  }
  const conIva = base * (1 + iva / 100);
  const envio = base >= envioGratisDesde ? 0 : 4.99;
  return Math.round((conIva + envio) * 100) / 100;
}
