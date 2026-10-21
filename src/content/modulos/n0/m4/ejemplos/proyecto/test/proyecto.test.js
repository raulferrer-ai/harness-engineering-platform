// test/proyecto.test.js — pruebas que cruzan los tres módulos (lección l03/l07)
import assert from "node:assert/strict";
import { test } from "node:test";

import { leerGastos } from "../src/gastos.js";
import { generarInforme } from "../src/informe.js";

// La ruta no depende de la carpeta desde la que se ejecute: se ancla al módulo.
const CSV = new URL("../datos/gastos.csv", import.meta.url);

test("leerGastos lee el CSV real del proyecto: 8 gastos", () => {
  const gastos = leerGastos(CSV);
  assert.strictEqual(gastos.length, 8);
  assert.strictEqual(gastos[0].categoria, "comida");
});

test("generarInforme calcula el total y la media del CSV real", () => {
  const informe = generarInforme(leerGastos(CSV));
  assert.match(informe, /total: 83\.69 EUR/);
  assert.match(informe, /media: 10\.46 EUR/);
});

test("generarInforme señala el gasto máximo", () => {
  const informe = generarInforme(leerGastos(CSV));
  assert.match(informe, /máximo: 42\.30 EUR/);
});

test("generarInforme lista las cuatro categorías en orden alfabético", () => {
  const lineas = generarInforme(leerGastos(CSV)).split("\n");
  const categorias = lineas.slice(6); // las cuatro líneas tras «por categoría:»
  assert.deepStrictEqual(categorias, [
    "  comida: 4 gasto(s), 8.00 EUR",
    "  hogar: 1 gasto(s), 42.30 EUR",
    "  ocio: 2 gasto(s), 27.99 EUR",
    "  transporte: 1 gasto(s), 5.40 EUR",
  ]);
});

test("leerGastos propaga el error del fichero inexistente", () => {
  assert.throws(
    () => leerGastos(new URL("../datos/no-existe.csv", import.meta.url)),
    /no existe el fichero/,
  );
});

test("el informe completo tiene diez líneas y empieza por su título", () => {
  const lineas = generarInforme(leerGastos(CSV)).split("\n");
  assert.strictEqual(lineas.length, 10);
  assert.strictEqual(lineas[0], "Informe de gastos");
});
