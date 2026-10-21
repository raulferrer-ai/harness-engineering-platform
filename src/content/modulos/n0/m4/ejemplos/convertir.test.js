// convertir.test.js — pruebas del módulo convertir.js (lección l01)
import assert from "node:assert/strict";
import { test } from "node:test";

import { EUR, importeEnEuros } from "./convertir.js";

test("importeEnEuros fija dos decimales y añade la moneda", () => {
  assert.strictEqual(importeEnEuros(1.85), "1.85 EUR");
});

test("importeEnEuros redondea los enteros a dos decimales", () => {
  assert.strictEqual(importeEnEuros(9), "9.00 EUR");
  assert.strictEqual(EUR, "EUR");
});

test("importeEnEuros rechaza lo que no es número", () => {
  assert.throws(() => importeEnEuros("1.85"), TypeError);
});
