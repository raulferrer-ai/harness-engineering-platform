import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { leerGastos, parseGastos } from "./leer-gastos.js";

const rutaReal = fileURLToPath(new URL("./datos/gastos.csv", import.meta.url));

test("parseGastos convierte un CSV de texto en registros", () => {
  const contenido = ["fecha,descripcion,categoria,importe", "2026-10-01,café,comida,2.50"].join(
    "\n",
  );
  assert.deepStrictEqual(parseGastos(contenido), [
    { fecha: "2026-10-01", descripcion: "café", categoria: "comida", importe: 2.5 },
  ]);
});

test("parseGastos ignora las líneas vacías", () => {
  const contenido = "fecha,descripcion,categoria,importe\n2026-10-01,pan,comida,1.85\n\n";
  assert.strictEqual(parseGastos(contenido).length, 1);
  assert.deepStrictEqual(parseGastos("fecha,descripcion,categoria,importe\n"), []);
});

test("parseGastos señala la línea exacta cuando falta un campo", () => {
  const contenido = ["fecha,descripcion,categoria,importe", "2026-10-01,café,comida"].join("\n");
  assert.throws(() => parseGastos(contenido), /línea 2: faltan campos/);
});

test("parseGastos rechaza importes que no son números", () => {
  const contenido = ["fecha,descripcion,categoria,importe", "2026-10-01,café,comida,abc"].join(
    "\n",
  );
  assert.throws(() => parseGastos(contenido), RangeError);
});

test("leerGastos lee el fichero real del módulo", () => {
  const gastos = leerGastos(rutaReal);
  assert.strictEqual(gastos.length, 8);
  assert.deepStrictEqual(gastos[0], {
    fecha: "2026-10-01",
    descripcion: "café",
    categoria: "comida",
    importe: 2.5,
  });
});

test("leerGastos defiende la ruta y el fichero inexistente", () => {
  assert.throws(() => leerGastos(""), TypeError);
  assert.throws(() => leerGastos(join("datos", "no-existe.csv")), /no existe el fichero/);
});
