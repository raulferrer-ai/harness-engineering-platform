// dependencias.test.js — pruebas con fixtures en memoria (lección l04)
import assert from "node:assert/strict";
import { test } from "node:test";

import { listarDependencias } from "./dependencias.js";

test("listarDependencias separa producción y desarrollo en orden alfabético", () => {
  const manifiesto = JSON.stringify({
    name: "demo",
    dependencies: { zeta: "^1.0.0", alpha: "~2.3.0" },
    devDependencies: { vitest: "^1.0.0" },
  });
  const secciones = listarDependencias(manifiesto);
  assert.deepStrictEqual(secciones.produccion, ["alpha", "zeta"]);
  assert.deepStrictEqual(secciones.desarrollo, ["vitest"]);
});

test("listarDependencias devuelve listas vacías sin dependencias", () => {
  const secciones = listarDependencias(JSON.stringify({ name: "demo", version: "1.0.0" }));
  assert.deepStrictEqual(secciones, { produccion: [], desarrollo: [] });
});

test("listarDependencias rechaza «dependencies» que no es un objeto", () => {
  const malformado = JSON.stringify({ name: "demo", dependencies: ["alpha"] });
  assert.throws(() => listarDependencias(malformado), TypeError);
});

test("listarDependencias no mezcla las dos secciones", () => {
  const manifiesto = JSON.stringify({
    name: "demo",
    devDependencies: { "solo-desarrollo": "^1.0.0" },
  });
  const secciones = listarDependencias(manifiesto);
  assert.deepStrictEqual(secciones.produccion, []);
  assert.deepStrictEqual(secciones.desarrollo, ["solo-desarrollo"]);
});
