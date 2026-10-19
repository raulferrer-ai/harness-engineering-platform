// saludo-funcion.js — una función pequeña y comprobable (lección l04)
export function saludar(nombre) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    throw new TypeError("saludar espera un texto no vacío");
  }
  return `Hola, ${nombre.trim()}`;
}
