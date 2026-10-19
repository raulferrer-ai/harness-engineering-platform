// celsius-a-fahrenheit.test.js — casos límite: no todos son 0 °C
import assert from "node:assert/strict";
import { test } from "node:test";

import { celsiusAFahrenheit } from "./celsius-a-fahrenheit.js";

test("0 grados Celsius son 32 Fahrenheit", () => {
  assert.strictEqual(celsiusAFahrenheit(0), 32);
});

test("100 grados Celsius son 212 Fahrenheit", () => {
  assert.strictEqual(celsiusAFahrenheit(100), 212);
});

test("-40 es el punto donde ambas escalas coinciden", () => {
  assert.strictEqual(celsiusAFahrenheit(-40), -40);
});
