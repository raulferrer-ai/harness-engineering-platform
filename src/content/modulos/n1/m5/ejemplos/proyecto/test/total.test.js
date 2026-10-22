import { test } from "node:test";
import assert from "node:assert/strict";
import { total } from "../src/total.js";

test("suma una lista de importes", () => {
  assert.equal(total([150, 250, 100]), 500);
});

test("lista vacía suma 0", () => {
  assert.equal(total([]), 0);
});

test("rechaza un importe no entero", () => {
  assert.throws(() => total([10, 2.5]), /importe no entero/);
});
