// estado-compartido.js — dos pruebas que comparten estado: el orden decide el resultado (rojo, l03)
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const carrito = []; // estado compartido en el ámbito del módulo: la trampa

describe("carrito compartido", () => {
  it("primer paso: añade un artículo", () => {
    carrito.push({ nombre: "teclado", precio: 45 });
    assert.strictEqual(carrito.length, 1);
  });

  it("segundo paso: el carrito sigue vacío", () => {
    // Cada prueba debería partir de cero; esta asume que nadie tocó el carrito.
    assert.strictEqual(carrito.length, 0, "cada prueba debería partir de cero");
  });
});
