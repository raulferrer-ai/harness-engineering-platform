// presupuesto.test.js — la suite del entregable: 8 pruebas contra presupuesto.js (lección l07)
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { totalPresupuesto } from "./presupuesto.js";

describe("totalPresupuesto", () => {
  it("aplica IVA y envío a una base pequeña", () => {
    assert.strictEqual(totalPresupuesto(10), 17.09);
  });

  it("gratifica el envío desde 50 € de base", () => {
    assert.strictEqual(totalPresupuesto(50), 60.5);
  });

  it("cobra envío justo por debajo del mínimo", () => {
    assert.strictEqual(totalPresupuesto(49.99), 65.48);
  });

  it("una base de 0 € arrastra el envío fijo", () => {
    assert.strictEqual(totalPresupuesto(0), 4.99);
  });

  it("admite otro IVA", () => {
    assert.strictEqual(totalPresupuesto(100, { iva: 10 }), 110);
  });

  it("redondea a dos decimales", () => {
    assert.strictEqual(totalPresupuesto(19.99), 29.18);
  });

  it("rechaza una base negativa con RangeError", () => {
    assert.throws(() => totalPresupuesto(-1), RangeError);
  });

  it("rechaza una base que no es número con RangeError", () => {
    assert.throws(() => totalPresupuesto("10"), RangeError);
  });
});
