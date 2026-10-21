// revisar-readme.test.js — pruebas del validador del README (lección l06)
import assert from "node:assert/strict";
import { test } from "node:test";

import { revisarReadme, SECCIONES_REQUERIDAS } from "./revisar-readme.js";

const readmeCompleto = SECCIONES_REQUERIDAS.join("\n");

test("revisarReadme acepta un README con las cinco secciones", () => {
  assert.deepStrictEqual(revisarReadme(readmeCompleto), []);
});

test("revisarReadme señala la sección que falta", () => {
  const sinVerificar = readmeCompleto.replace("## Cómo verificar", "");
  assert.deepStrictEqual(revisarReadme(sinVerificar), ["falta ## Cómo verificar"]);
});

test("revisarReadme lista las cinco secciones cuando el README está vacío", () => {
  assert.strictEqual(revisarReadme("").length, 5);
});
