import assert from "node:assert/strict";
import { test } from "node:test";

import { maximoImporte, sumaImportes } from "./acumular.js";

test("sumaImportes acumula la lista entera", () => {
  assert.strictEqual(sumaImportes([]), 0);
  assert.strictEqual(sumaImportes([1, 2, 3, 4]), 10);
  assert.strictEqual(sumaImportes([2.5, 1.5]), 4);
});

test("sumaImportes rechaza lo que no sea lista o elemento válido", () => {
  assert.throws(() => sumaImportes("123"), TypeError);
  assert.throws(() => sumaImportes([1, "2"]), TypeError);
  assert.throws(() => sumaImportes([Number.NaN]), TypeError);
});

test("maximoImporte devuelve el mayor de la lista", () => {
  assert.strictEqual(maximoImporte([3, 9, 4]), 9);
  assert.strictEqual(maximoImporte([7]), 7);
});

test("maximoImporte trata la lista vacía como error de rango", () => {
  assert.throws(() => maximoImporte([]), RangeError);
  assert.throws(() => maximoImporte("no"), TypeError);
});
