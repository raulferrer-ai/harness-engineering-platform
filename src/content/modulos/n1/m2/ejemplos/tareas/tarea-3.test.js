// tareas/tarea-3.test.js — criterios de aceptación de la tarea 3, en formato prueba
// Ejecución: node --test tareas/tarea-3.test.js

import { test } from "node:test";
import assert from "node:assert/strict";

import { sumaDecimales } from "./tarea-3.js";

test("0.1 + 0.2 es exactamente 0.3", () => {
  assert.equal(sumaDecimales(0.1, 0.2), 0.3);
});

test("1.1 + 2.2 es exactamente 3.3", () => {
  assert.equal(sumaDecimales(1.1, 2.2), 3.3);
});

test("los negativos también quedan a dos decimales", () => {
  assert.equal(sumaDecimales(-0.15, 0.05), -0.1);
});
