// articulo.js — modelar un artículo como registro validado y congelado (lección l06)
export function crearArticulo(nombre, precio, cantidad = 1) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    throw new TypeError("crearArticulo espera un nombre no vacío");
  }
  if (typeof precio !== "number" || Number.isNaN(precio) || precio < 0) {
    throw new TypeError("espera un precio numérico no negativo");
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new RangeError("espera una cantidad entera mayor o igual a 1");
  }
  return Object.freeze({ nombre: nombre.trim(), precio, cantidad });
}

export function totalArticulo(articulo) {
  if (articulo === null || typeof articulo !== "object") {
    throw new TypeError("totalArticulo espera un artículo");
  }
  return articulo.precio * articulo.cantidad;
}
