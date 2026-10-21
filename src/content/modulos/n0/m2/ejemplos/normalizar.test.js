import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizar } from "./normalizar.js";

test("normalizar recorta los espacios y pasa a minúsculas", () => {
  assert.strictEqual(normalizar("  HOLA Mundo "), "hola mundo");
});

test("normalizar colapsa espacios y tabulaciones internas en uno solo", () => {
  assert.strictEqual(normalizar("pan\tsurtido   grande"), "pan surtido grande");
});

test("normalizar devuelve texto vacío para una cadena de espacios", () => {
  assert.strictEqual(normalizar("   "), "");
});

test("normalizar rechaza lo que no sea texto", () => {
  assert.throws(() => normalizar(42), TypeError);
  assert.throws(() => normalizar(undefined), TypeError);
});
