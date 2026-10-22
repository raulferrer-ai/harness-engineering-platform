import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { total } from "./total.js";

describe("total", () => {
  it("suma importes simples", () => {
    assert.strictEqual(total([10, 20, 30]), 60);
  });

  it("redondea el ruido decimal", () => {
    assert.strictEqual(total([0.1, 0.2]), 0.3);
  });

  it("lista vacía → 0", () => {
    assert.strictEqual(total([]), 0);
  });
});
