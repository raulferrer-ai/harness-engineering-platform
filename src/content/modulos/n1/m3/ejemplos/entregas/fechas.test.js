import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { esBisiesto } from "./fechas-despues.js";

describe("esBisiesto (entrega)", () => {
  it("2024 es bisiesto", () => {
    assert.strictEqual(esBisiesto(2024), true);
  });

  it("1900 no es bisiesto (siglo no múltiplo de 400)", () => {
    assert.strictEqual(esBisiesto(1900), false);
  });

  it("2000 es bisiesto (siglo múltiplo de 400)", () => {
    assert.strictEqual(esBisiesto(2000), true);
  });

  it("2023 no es bisiesto", () => {
    assert.strictEqual(esBisiesto(2023), false);
  });
});
