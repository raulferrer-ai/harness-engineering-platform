// tareas/tarea-2.test.js — criterios de aceptación de la tarea 2, en formato prueba
// Ejecución: node --test tareas/tarea-2.test.js

import { test } from "node:test";
import assert from "node:assert/strict";

import { contarLineas } from "./tarea-2.js";

test("cuenta tres líneas con \\n", () => {
  assert.equal(contarLineas("a\nb\nc"), 3);
});

test("acepta saltos \\r\\n", () => {
  assert.equal(contarLineas("a\r\nb"), 2);
});

test("una cadena vacía tiene cero líneas", () => {
  assert.equal(contarLineas(""), 0);
});

test("la línea vacía final no cuenta", () => {
  assert.equal(contarLineas("uno\ndos\n"), 2);
});
