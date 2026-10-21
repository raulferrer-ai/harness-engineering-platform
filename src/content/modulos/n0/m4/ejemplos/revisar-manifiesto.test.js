// revisar-manifiesto.test.js — pruebas con fixtures en memoria (lección l02)
import assert from "node:assert/strict";
import { test } from "node:test";

import { revisarManifiesto } from "./revisar-manifiesto.js";

const manifiestoValido = JSON.stringify({
  name: "informe-gastos",
  version: "1.0.0",
  type: "module",
  scripts: { test: "node --test test/" },
});

test("revisarManifiesto acepta un manifiesto completo", () => {
  assert.deepStrictEqual(revisarManifiesto(manifiestoValido), []);
});

test("revisarManifiesto exige «type: module»", () => {
  const sinTipo = JSON.stringify({ name: "x", version: "1.0.0", scripts: { test: "node --test" } });
  const problemas = revisarManifiesto(sinTipo);
  assert.strictEqual(problemas.length, 1);
  assert.match(problemas[0], /type: module/);
});

test("revisarManifiesto exige una versión x.y.z", () => {
  const versionCorta = JSON.stringify({
    name: "x",
    version: "1.0",
    type: "module",
    scripts: { test: "node --test" },
  });
  const problemas = revisarManifiesto(versionCorta);
  assert.strictEqual(problemas.length, 1);
  assert.match(problemas[0], /x\.y\.z/);
});

test("revisarManifiesto rechaza un JSON roto con TypeError", () => {
  assert.throws(() => revisarManifiesto("{ no es json }"), TypeError);
});
