import { describe, expect, it } from "vitest";

// PRUEBA DELIBERADA DEL GATE (§8.4.5) — NO FUSIONAR ESTA RAMA.
// Existe únicamente para verificar que un check en rojo bloquea la fusión.
describe("prueba de fallo deliberado del gate", () => {
  it("falla a propósito para dejar «Comprobaciones y compilación» en rojo", () => {
    expect(true).toBe(false);
  });
});
