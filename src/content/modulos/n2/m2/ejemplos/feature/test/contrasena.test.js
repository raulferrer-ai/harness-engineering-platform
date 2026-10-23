// test/contrasena.test.js — la feature se pidió escribiendo primero estas
// pruebas: cada una entró en rojo y se cerró en verde; registro.json guarda
// los seis ciclos con lo que se vio en cada paso.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { esValida, incumplidas } from "../contrasena.js";

describe("contrasena", () => {
  it("esValida: una clave corta no vale", () => {
    assert.strictEqual(esValida("Ab1"), false);
  });

  it("esValida: nueve minúsculas sin dígito no valen", () => {
    assert.strictEqual(esValida("abcdefghi"), false);
  });

  it("esValida: con dígito pero sin mayúscula no vale", () => {
    assert.strictEqual(esValida("abcdefgh1"), false);
  });

  it("esValida: la forma canónica vale en el límite", () => {
    assert.strictEqual(esValida("Abcdefg1"), true);
  });

  it("esValida: una entrada que no es texto no vale", () => {
    assert.strictEqual(esValida(null), false);
  });

  it("incumplidas: nombra las reglas rotas y las que cumplen", () => {
    assert.deepStrictEqual(incumplidas("abc"), ["longitud", "digito", "mayuscula"]);
    assert.deepStrictEqual(incumplidas("Abcdefg1"), []);
  });
});
