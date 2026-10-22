import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resumen } from "./informes-despues.js";

describe("resumen (entrega)", () => {
  it("calcula top y media de importes normales", () => {
    assert.deepStrictEqual(resumen([10, 20, 30]), { top: 30, media: 20 });
  });

  it("redondea la media a dos decimales", () => {
    assert.deepStrictEqual(resumen([1, 2]), { top: 2, media: 1.5 });
  });

  it("resumen de un solo importe", () => {
    assert.deepStrictEqual(resumen([5]), { top: 5, media: 5 });
  });

  it("una lista vacía devuelve top null y media 0", () => {
    assert.deepStrictEqual(resumen([]), { top: null, media: 0 });
  });
});
