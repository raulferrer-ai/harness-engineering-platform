import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { generarInforme } from "./informe.js";

const rutaReal = fileURLToPath(new URL("./datos/gastos.csv", import.meta.url));

test("generarInforme resume el fichero real con sus agregados", () => {
  const informe = generarInforme(rutaReal);
  assert.ok(informe.includes("gastos: 8"));
  assert.ok(informe.includes("total: 83.69 EUR"));
  assert.ok(informe.includes("media: 10.46 EUR"));
  assert.ok(informe.includes("máximo: 42.30 EUR"));
});

test("generarInforme lista las categorías ordenadas con sus totales", () => {
  const informe = generarInforme(rutaReal);
  assert.ok(informe.includes("  comida: 4 gasto(s), 8.00 EUR"));
  assert.ok(informe.includes("  transporte: 1 gasto(s), 5.40 EUR"));
});

test("generarInforme propaga el error del fichero inexistente", () => {
  assert.throws(() => generarInforme("no-existe.csv"), /no existe el fichero/);
});
