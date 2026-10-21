// descripcion-articulo.js — compone las funciones del módulo (lección l07)
import { totalArticulo } from "./articulo.js";
import { centsAEuros, eurosACents } from "./dinero.js";
import { normalizar } from "./normalizar.js";

export function descripcionArticulo(articulo) {
  const nombre = normalizar(articulo.nombre);
  const total = centsAEuros(eurosACents(totalArticulo(articulo)));
  return `${nombre} — ${articulo.cantidad} uds × ${articulo.precio} EUR = ${total} EUR`;
}
