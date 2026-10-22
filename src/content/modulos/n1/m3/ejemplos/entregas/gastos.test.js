import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { total } from "./gastos-despues.js";

describe("total (entrega)", () => {
  it("una lista vacía suma 0", () => {
    assert.strictEqual(total([]), 0);
  });

  it("suma importes simples", () => {
    assert.strictEqual(total([{ importe: 3.5 }, { importe: 7 }]), 10.5);
  });

  it("corrige el ruido decimal de 0.1 + 0.2", () => {
    assert.strictEqual(total([{ importe: 0.1 }, { importe: 0.2 }]), 0.3);
  });

  it("devuelve un número, no un texto", () => {
    assert.strictEqual(typeof total([{ importe: 10.5 }]), "number");
  });
});
