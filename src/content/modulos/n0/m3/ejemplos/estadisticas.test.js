import assert from "node:assert/strict";
import { test } from "node:test";

import { filtrarPorCategoria, importesDe, mediaImportes, totalImportes } from "./estadisticas.js";
import { crearGasto } from "./gastos.js";

const gastos = [
  crearGasto("café", "comida", 2.5),
  crearGasto("libro", "ocio", 19),
  crearGasto("pan", "comida", 1.5),
];

test("importesDe proyecta la lista con map", () => {
  assert.deepStrictEqual(importesDe(gastos), [2.5, 19, 1.5]);
  assert.deepStrictEqual(importesDe([]), []);
  assert.throws(() => importesDe("lista"), TypeError);
});

test("filtrarPorCategoria selecciona sin tocar la original", () => {
  const comidas = filtrarPorCategoria(gastos, "comida");
  assert.strictEqual(comidas.length, 2);
  assert.strictEqual(gastos.length, 3);
  assert.deepStrictEqual(filtrarPorCategoria(gastos, "transporte"), []);
  assert.throws(() => filtrarPorCategoria(gastos, 42), TypeError);
});

test("totalImportes acumula con reduce y empieza en cero", () => {
  assert.strictEqual(totalImportes([]), 0);
  assert.strictEqual(totalImportes(importesDe(gastos)), 23);
  assert.throws(() => totalImportes("lista"), TypeError);
});

test("mediaImportes divide entre el número de elementos", () => {
  assert.strictEqual(mediaImportes([2, 4, 6]), 4);
  assert.throws(() => mediaImportes([]), RangeError);
  assert.throws(() => mediaImportes("lista"), TypeError);
});
