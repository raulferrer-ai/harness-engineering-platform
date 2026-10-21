import assert from "node:assert/strict";
import { test } from "node:test";

import { nivelImporte, zonaCategoria } from "./clasificar.js";

test("nivelImporte reparte los importes en los tres tramos", () => {
  assert.strictEqual(nivelImporte(0), "pequeño");
  assert.strictEqual(nivelImporte(9.99), "pequeño");
  assert.strictEqual(nivelImporte(10), "medio");
  assert.strictEqual(nivelImporte(49.99), "medio");
  assert.strictEqual(nivelImporte(50), "grande");
});

test("nivelImporte valida el tipo y el signo", () => {
  assert.throws(() => nivelImporte("10"), TypeError);
  assert.throws(() => nivelImporte(Number.NaN), TypeError);
  assert.throws(() => nivelImporte(-1), RangeError);
});

test("zonaCategoria agrupa por zona y tiene default", () => {
  assert.strictEqual(zonaCategoria("comida"), "necesario");
  assert.strictEqual(zonaCategoria("hogar"), "necesario");
  assert.strictEqual(zonaCategoria("ocio"), "discrecional");
  assert.strictEqual(zonaCategoria("viaje"), "sin clasificar");
});

test("zonaCategoria rechaza lo que no sea texto", () => {
  assert.throws(() => zonaCategoria(42), TypeError);
});
