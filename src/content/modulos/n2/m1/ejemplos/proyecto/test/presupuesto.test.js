// presupuesto.test.js — la suite que cierra el contrato de spec.md.
// Un test por criterio: la numeración (C1…) coincide con la spec para que
// cualquier fallo se pueda rastrear hasta su criterio.
import assert from "node:assert/strict";
import { test } from "node:test";

import { totalFactura } from "../presupuesto.js";

test("C1 · total de una línea sin impuesto ni descuento", () => {
  assert.equal(totalFactura([{ importe: 100, impuesto: 0, descuento: 0 }]), 100);
});

test("C2 · el descuento se aplica antes que el impuesto", () => {
  assert.equal(totalFactura([{ importe: 100, impuesto: 21, descuento: 10 }]), 108.9);
});

test("C3 · la lista vacía totaliza cero", () => {
  assert.equal(totalFactura([]), 0);
});

test("C4 · una línea a cero no aporta nada", () => {
  assert.equal(totalFactura([{ importe: 0, impuesto: 21, descuento: 50 }]), 0);
});
