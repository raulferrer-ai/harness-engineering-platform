import assert from "node:assert/strict";
import { test } from "node:test";

import { centsAEuros, eurosACents } from "./dinero.js";

test("eurosACents convierte a céntimos enteros", () => {
  assert.strictEqual(eurosACents(12.34), 1234);
  assert.strictEqual(eurosACents(0), 0);
});

test("eurosACents absorbe el ruido decimal del punto flotante", () => {
  // 0.1 + 0.2 es 0.30000000000000004 en coma flotante; en céntimos, exacto.
  assert.strictEqual(0.1 + 0.2, 0.30000000000000004);
  assert.strictEqual(eurosACents(0.1 + 0.2), 30);
});

test("eurosACents rechaza entradas que no son números válidos", () => {
  assert.throws(() => eurosACents("12.34"), TypeError);
  assert.throws(() => eurosACents(Number.NaN), TypeError);
  assert.throws(() => eurosACents(-1), RangeError);
});

test("centsAEuros devuelve el decimal equivalente", () => {
  assert.strictEqual(centsAEuros(1234), 12.34);
  assert.strictEqual(centsAEuros(0), 0);
  assert.throws(() => centsAEuros(12.5), RangeError);
  assert.throws(() => centsAEuros(-10), RangeError);
});
