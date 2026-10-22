// H15 (l04) — ejecuta la batería de casos límite declarada en la tarea
// contra el código entregado. La suite de la entrega no los cubre todos;
// aquí se ejecutan los que la tarea exigía.
import assert from "node:assert/strict";

import { entregas } from "./entregas/datos.js";

export async function probarEntrega(entrega) {
  const modulo = await import(new URL(`./entregas/${entrega.id}-despues.js`, import.meta.url));
  const funcion = modulo[entrega.funcion];
  const resultados = [];
  for (const caso of entrega.casosLimite) {
    try {
      assert.deepStrictEqual(funcion(...caso.llamada), caso.esperado);
      resultados.push({ caso, ok: true });
    } catch (error) {
      resultados.push({ caso, ok: false, error });
    }
  }
  return resultados;
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const entrega of entregas) {
    const resultados = await probarEntrega(entrega);
    const verdes = resultados.filter((r) => r.ok).length;
    for (const resultado of resultados) {
      const llamada = JSON.stringify(resultado.caso.llamada);
      if (resultado.ok) {
        console.log(`✓ ${entrega.id}: ${llamada} → ${JSON.stringify(resultado.caso.esperado)}`);
      } else {
        console.log(
          `✗ ${entrega.id}: ${llamada} → ${resultado.error.name}: ${resultado.error.message}`,
        );
      }
    }
    console.log(`${entrega.id}: ${verdes} de ${resultados.length} casos límite en verde`);
  }
  console.log(
    "un caso límite en rojo devuelve la entrega aunque la suite propia esté en verde: la tarea exigía esas fronteras",
  );
}
