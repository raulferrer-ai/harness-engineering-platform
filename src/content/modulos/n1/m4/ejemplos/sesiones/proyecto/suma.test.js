import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { suma, sumaLista } from "./suma.js";

describe("suma", () => {
  it("suma dos números", () => {
    assert.strictEqual(suma(2, 3), 5);
  });

  it("admite negativos", () => {
    assert.strictEqual(suma(-4, 4), 0);
  });

  it("sumaLista vacía es 0", () => {
    assert.strictEqual(sumaLista([]), 0);
  });
});
