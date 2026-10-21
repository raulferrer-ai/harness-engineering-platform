// aserciones-intencion.js — node:assert con mensajes que explican la intención (lección l02)
import assert from "node:assert/strict";

const carrito = [
  { nombre: "teclado", precio: 45 },
  { nombre: "raton", precio: 25 },
];

// 1) Igualdad estricta: mismo valor y mismo tipo, sin coerción.
assert.strictEqual(carrito.length, 2, "el carrito debe conservar los dos artículos");

// 2) Comparación profunda: objeto completo, campo a campo.
assert.deepStrictEqual(carrito[0], { nombre: "teclado", precio: 45 }, "el primer artículo se guarda entero");

// 3) Excepción esperada: el contrato de una función defensiva.
assert.throws(
  () => carrito.at(99).precio,
  TypeError,
  "acceder a un artículo inexistente debe lanzar TypeError",
);

// 4) Texto: una aserción sobre la forma del dato.
assert.match(carrito[1].nombre, /^rat/, "el segundo artículo empieza por «rat»");

console.log("4 aserciones en verde: estricta, profunda, excepción y texto");
