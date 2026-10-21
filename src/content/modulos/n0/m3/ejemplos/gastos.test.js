import assert from "node:assert/strict";
import { test } from "node:test";

import { agregarGasto, crearGasto, gastoEn } from "./gastos.js";

const cafe = crearGasto("  café ", "comida", 2.5);

test("crearGasto devuelve un registro validado y recortado", () => {
  assert.deepStrictEqual(cafe, { descripcion: "café", categoria: "comida", importe: 2.5 });
  assert.throws(() => crearGasto("", "comida", 2.5), TypeError);
  assert.throws(() => crearGasto("café", "", 2.5), TypeError);
  assert.throws(() => crearGasto("café", "comida", -1), TypeError);
});

test("agregarGasto devuelve una lista nueva sin tocar la original", () => {
  const lista = [cafe];
  const ampliada = agregarGasto(lista, crearGasto("pan", "comida", 1.85));
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(ampliada.length, 2);
  assert.strictEqual(ampliada[1].descripcion, "pan");
});

test("agregarGasto valida la lista y el gasto", () => {
  assert.throws(() => agregarGasto("no soy lista", cafe), TypeError);
  assert.throws(() => agregarGasto([cafe], "no soy gasto"), TypeError);
});

test("gastoEn lee por posición y defiende los límites", () => {
  const lista = [cafe, crearGasto("pan", "comida", 1.85)];
  assert.strictEqual(gastoEn(lista, 0).descripcion, "café");
  assert.strictEqual(gastoEn(lista, 1).descripcion, "pan");
  assert.throws(() => gastoEn(lista, 2), RangeError);
  assert.throws(() => gastoEn(lista, -1), RangeError);
  assert.throws(() => gastoEn(lista, 0.5), RangeError);
  assert.throws(() => gastoEn("lista", 0), TypeError);
});
