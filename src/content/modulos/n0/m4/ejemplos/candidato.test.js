// candidato.test.js — pruebas del evaluador de candidatos (lección l05)
import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluarCandidato } from "./candidato.js";

const HOY = "2026-10-21";

test("evaluarCandidato acepta un candidato con licencia, pruebas y vigencia", () => {
  const candidato = {
    nombre: "sano",
    licencia: "MIT",
    tienePruebas: true,
    ultimaPublicacion: "2026-08-01",
  };
  assert.deepStrictEqual(evaluarCandidato(candidato, HOY), { veredicto: "aceptar", motivos: [] });
});

test("evaluarCandidato descarta las licencias no permisivas", () => {
  const candidato = {
    nombre: "copyleft-duro",
    licencia: "GPL-3.0",
    tienePruebas: true,
    ultimaPublicacion: "2026-08-01",
  };
  const { veredicto, motivos } = evaluarCandidato(candidato, HOY);
  assert.strictEqual(veredicto, "descartar");
  assert.match(motivos[0], /licencia no permitida: GPL-3.0/);
});

test("evaluarCandidato pide revisión cuando no declara pruebas", () => {
  const candidato = {
    nombre: "sin-pruebas",
    licencia: "MIT",
    tienePruebas: false,
    ultimaPublicacion: "2026-08-01",
  };
  const { veredicto, motivos } = evaluarCandidato(candidato, HOY);
  assert.strictEqual(veredicto, "revisar");
  assert.match(motivos[0], /no declara pruebas/);
});

test("evaluarCandidato pide revisión si lleva más de dos años sin publicar", () => {
  const candidato = {
    nombre: "abandonado",
    licencia: "MIT",
    tienePruebas: true,
    ultimaPublicacion: "2023-01-01",
  };
  const { veredicto, motivos } = evaluarCandidato(candidato, HOY);
  assert.strictEqual(veredicto, "revisar");
  assert.match(motivos[0], /dos años/);
});
