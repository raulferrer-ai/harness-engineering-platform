// saludo-funcion.test.js — pruebas con el ejecutor y el módulo de aserciones incluidos en Node
import assert from "node:assert/strict";
import { test } from "node:test";

import { saludar } from "./saludo-funcion.js";

test("saludar devuelve un saludo con el nombre", () => {
  assert.strictEqual(saludar("mundo"), "Hola, mundo");
});

test("saludar recorta los espacios sobrantes", () => {
  assert.strictEqual(saludar("  Ada  "), "Hola, Ada");
});

test("saludar rechaza entradas que no son texto no vacío", () => {
  assert.throws(() => saludar(42), TypeError);
  assert.throws(() => saludar("   "), TypeError);
});
