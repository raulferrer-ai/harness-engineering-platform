import assert from "node:assert/strict";
import { test } from "node:test";

import { crearArticulo, totalArticulo } from "./articulo.js";

test("crearArticulo devuelve un registro con los tres campos", () => {
  const articulo = crearArticulo("café", 2.5, 3);
  assert.deepStrictEqual(articulo, { nombre: "café", precio: 2.5, cantidad: 3 });
});

test("crearArticulo recorta el nombre y usa cantidad 1 por defecto", () => {
  const articulo = crearArticulo("  té  ", 1.2);
  assert.strictEqual(articulo.nombre, "té");
  assert.strictEqual(articulo.cantidad, 1);
});

test("el artículo congelado rechaza cambios", () => {
  const articulo = crearArticulo("café", 2.5, 3);
  assert.throws(() => {
    articulo.precio = 99;
  }, TypeError);
});

test("crearArticulo valida cada campo con su tipo de error", () => {
  assert.throws(() => crearArticulo("", 2.5), TypeError);
  assert.throws(() => crearArticulo("café", "2.5"), TypeError);
  assert.throws(() => crearArticulo("café", Number.NaN), TypeError);
  assert.throws(() => crearArticulo("café", 2.5, 0), RangeError);
  assert.throws(() => crearArticulo("café", 2.5, 1.5), RangeError);
});

test("totalArticulo multiplica precio por cantidad", () => {
  assert.strictEqual(totalArticulo(crearArticulo("café", 2.5, 3)), 7.5);
  assert.strictEqual(totalArticulo(crearArticulo("té", 1.2)), 1.2);
  assert.throws(() => totalArticulo("café"), TypeError);
  assert.throws(() => totalArticulo(null), TypeError);
});
