import assert from "node:assert/strict";
import { test } from "node:test";

import { crearArticulo } from "./articulo.js";
import { descripcionArticulo } from "./descripcion-articulo.js";

test("descripcionArticulo compone nombre, dinero y registro en una línea", () => {
  const articulo = crearArticulo("  Pan de Molde ", 2, 3);
  assert.strictEqual(
    descripcionArticulo(articulo),
    "pan de molde — 3 uds × 2 EUR = 6 EUR",
  );
});

test("el total pierde el ruido decimal al pasar por céntimos", () => {
  const articulo = crearArticulo("lápiz", 0.1, 3);
  assert.strictEqual(articulo.precio * articulo.cantidad, 0.30000000000000004);
  assert.strictEqual(
    descripcionArticulo(articulo),
    "lápiz — 3 uds × 0.1 EUR = 0.3 EUR",
  );
});

test("un error de una función interna se propaga con su tipo", () => {
  const roto = { nombre: "café", precio: Number.NaN, cantidad: 1 };
  assert.throws(() => descripcionArticulo(roto), TypeError);
});
