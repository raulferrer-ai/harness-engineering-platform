import assert from "node:assert/strict";
import { test } from "node:test";

import { crearGasto } from "./gastos.js";
import { categoriasUnicas, cuentaPorCategoria, importesPorCategoria } from "./resumen-categorias.js";

const gastos = [
  crearGasto("café", "comida", 2.5),
  crearGasto("libro", "ocio", 19),
  crearGasto("pan", "comida", 1.5),
];

test("cuentaPorCategoria devuelve un diccionario de recuentos", () => {
  assert.deepStrictEqual(cuentaPorCategoria(gastos), { comida: 2, ocio: 1 });
  assert.deepStrictEqual(cuentaPorCategoria([]), {});
  assert.throws(() => cuentaPorCategoria("lista"), TypeError);
});

test("categoriasUnicas devuelve las categorías ordenadas y sin repetir", () => {
  assert.deepStrictEqual(categoriasUnicas(gastos), ["comida", "ocio"]);
  assert.deepStrictEqual(categoriasUnicas([]), []);
  assert.throws(() => categoriasUnicas("lista"), TypeError);
});

test("importesPorCategoria acumula los importes en un Map", () => {
  const acumulados = importesPorCategoria(gastos);
  assert.ok(acumulados instanceof Map);
  assert.strictEqual(acumulados.get("comida"), 4);
  assert.strictEqual(acumulados.get("ocio"), 19);
  assert.strictEqual(acumulados.get("transporte"), undefined);
  assert.strictEqual(importesPorCategoria([]).size, 0);
  assert.throws(() => importesPorCategoria("lista"), TypeError);
});
