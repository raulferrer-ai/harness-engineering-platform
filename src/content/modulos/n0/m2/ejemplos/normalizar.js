// normalizar.js — lleva un texto a una forma comparable (lección l03)
export function normalizar(texto) {
  if (typeof texto !== "string") {
    throw new TypeError("normalizar espera un texto");
  }
  return texto
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
