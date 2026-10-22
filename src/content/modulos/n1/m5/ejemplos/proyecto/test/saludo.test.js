import { test } from "node:test";
import assert from "node:assert/strict";
import { saludo } from "../src/saludo.js";

test("saluda por nombre", () => {
  assert.equal(saludo("Ada"), "Hola, Ada!");
});

test("acepta nombres con espacios", () => {
  assert.equal(saludo("Grace Hopper"), "Hola, Grace Hopper!");
});

test("rechaza nombre vacío", () => {
  assert.throws(() => saludo(""), /nombre vacío/);
});
