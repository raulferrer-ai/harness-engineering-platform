// tareas/tarea-1.test.js — criterios de aceptación de la tarea 1, en formato prueba
// Ejecución: node --test tareas/tarea-1.test.js
// Con BORRADOR=1 importa el borrador plausible (fase rojo de criterios-primero.js);
// por defecto importa la entrega de referencia (fase verde).

import { test } from "node:test";
import assert from "node:assert/strict";

const ruta = process.env.BORRADOR === "1" ? "./tarea-1-borrador.js" : "./tarea-1.js";
const { normalizarNombre } = await import(ruta);

test("colapsa espacios dobles", () => {
  assert.equal(normalizarNombre("Ana   maría"), "Ana María");
});

test("recorta extremos y pone mayúscula inicial", () => {
  assert.equal(normalizarNombre("  luis  "), "Luis");
});

test("todo lo demás queda en minúsculas", () => {
  assert.equal(normalizarNombre("cARLOS lÓPEZ"), "Carlos López");
});

test("una cadena vacía devuelve una cadena vacía", () => {
  assert.equal(normalizarNombre(""), "");
});
