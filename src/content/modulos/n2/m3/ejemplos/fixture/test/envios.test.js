// Suite de comportamiento: son los que fijan el contrato de envios.js.
// Refactoriza sin tocarla; si falla, no era refactor.

import { test } from "node:test";
import assert from "node:assert/strict";
import { costeEnvio, resumenPedido } from "../envios.js";

test("costeEnvio: envío nacional de 1 kg cuesta la tarifa base", () => {
  assert.strictEqual(costeEnvio({ peso: 1, zona: "nacional" }), 3.5);
});

test("costeEnvio: 3 kg a europea suman el tramo ligero por kilo", () => {
  assert.strictEqual(costeEnvio({ peso: 3, zona: "europea" }), 9.5);
});

test("costeEnvio: 10 kg al internacional suman base, tramo medio y resto", () => {
  assert.strictEqual(costeEnvio({ peso: 10, zona: "internacional" }), 29.9);
});

test("costeEnvio: el recargo express multiplica el total por 1,5", () => {
  assert.strictEqual(costeEnvio({ peso: 2, zona: "nacional", express: true }), 7.05);
});

test("costeEnvio: 20 kg se acepta y 21 kg lanza «peso no soportado»", () => {
  assert.strictEqual(costeEnvio({ peso: 20, zona: "nacional" }), 21.8);
  assert.throws(() => costeEnvio({ peso: 21, zona: "nacional" }), /peso no soportado/);
});

test("resumenPedido: separa el total del extra de express", () => {
  assert.deepStrictEqual(resumenPedido({ peso: 2, zona: "europea", express: true }), {
    total: 11.55,
    extra: 3.85,
  });
});
