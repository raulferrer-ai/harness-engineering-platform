// clasificar.js — decisiones con if/else-if y switch (lección l01)
export function nivelImporte(importe) {
  if (typeof importe !== "number" || Number.isNaN(importe)) {
    throw new TypeError("nivelImporte espera un número");
  }
  if (importe < 0) {
    throw new RangeError("nivelImporte no acepta negativos");
  }
  if (importe < 10) {
    return "pequeño";
  }
  if (importe < 50) {
    return "medio";
  }
  return "grande";
}

export function zonaCategoria(categoria) {
  if (typeof categoria !== "string") {
    throw new TypeError("zonaCategoria espera una categoría (texto)");
  }
  switch (categoria) {
    case "comida":
    case "hogar":
      return "necesario";
    case "ocio":
      return "discrecional";
    default:
      return "sin clasificar";
  }
}
