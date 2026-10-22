// logica-plausible.js — rojo de l03: código plausible que no pasa su prueba
// (AssertionError). La función parece correcta en el uso normal; el caso
// límite declarado la desmonta. La lección: ejecutar el caso, no leerlo.
import assert from "node:assert/strict";
import { descuento } from "../fallos/casos.js";

// En el uso normal parece bien: 100 - 10% = 90.
assert.equal(descuento(100, 10), 90);

// El caso límite con céntimos: el asistente prometía 17.99, el código da 18.
assert.equal(descuento(19.99, 10), 17.99);
