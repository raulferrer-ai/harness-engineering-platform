import assert from "node:assert/strict";
import { test } from "node:test";

import { dividir } from "./dividir.js";

test("dividir devuelve el cociente exacto", () => {
  assert.strictEqual(dividir(10, 2), 5);
});

test("dividir admite cocientes con decimales", () => {
  assert.strictEqual(dividir(7, 2), 3.5);
});

test("dividir rechaza entradas que no son números", () => {
  assert.throws(() => dividir("10", 2), TypeError);
  assert.throws(() => dividir(10, "2"), TypeError);
  assert.throws(() => dividir(Number.NaN, 2), TypeError);
});

test("dividir señala la división entre cero como error de rango", () => {
  assert.throws(() => dividir(10, 0), RangeError);
});
