// descuento.test.js — estructura de una suite: describe, it y beforeEach (lección l03)
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { aplicarDescuento } from "./descuento.js";

describe("aplicarDescuento", () => {
  let carrito;

  beforeEach(() => {
    // Cada prueba arranca con el mismo estado: el aislamiento vive aquí.
    carrito = [
      { nombre: "teclado", precio: 45 },
      { nombre: "raton", precio: 25 },
    ];
  });

  it("aplica un 10 % sobre un artículo", () => {
    assert.strictEqual(aplicarDescuento(45, 10), 40.5);
  });

  it("no cambia nada con 0 %", () => {
    assert.strictEqual(aplicarDescuento(25, 0), 25);
  });

  it("redondea a dos decimales", () => {
    assert.strictEqual(aplicarDescuento(19.99, 15), 16.99);
  });

  it("rechaza un porcentaje fuera de rango con RangeError", () => {
    assert.throws(() => aplicarDescuento(10, 60), RangeError);
  });

  it("rechaza un precio que no es número con TypeError", () => {
    assert.throws(() => aplicarDescuento("45", 10), TypeError);
  });

  it("cada prueba ve su propio carrito: empujar no contamina a las demás", () => {
    carrito.push({ nombre: "monitor", precio: 200 });
    assert.strictEqual(carrito.length, 3);
  });
});
