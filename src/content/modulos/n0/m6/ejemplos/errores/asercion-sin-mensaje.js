// asercion-sin-mensaje.js — una aserción sin contexto: el fallo no explica la intención (rojo, l02)
import assert from "node:assert/strict";

const base = 450;
const totalConIva = base;

// Sin mensaje y sin contrato: si esto falla, el error solo compara números.
assert.strictEqual(totalConIva, 544.5);
