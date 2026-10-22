/** Saludo parametrizable del mini-proyecto. */
export function saludo(nombre) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    throw new Error("saludo: nombre vacío");
  }
  return `Hola, ${nombre}!`;
}
