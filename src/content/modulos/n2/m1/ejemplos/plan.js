// plan.js — demo de l01: el plan tiene secciones verificables.
// Antes de pedir nada al asistente, el plan acota objetivo, alcance, lo que
// queda fuera y cómo se sabrá entregado. Cada sección es un requisito del
// fichero, no una costumbre: si falta, leerPlan lanza.
import { leerPlan } from "./ciclo.js";

const ruta = process.argv[2] ?? "proyecto/PLAN.md";
console.log(`leyendo el plan de ${ruta}:`);
const { secciones } = leerPlan(ruta);
for (const seccion of secciones) {
  console.log(` ✓ ${seccion}`);
}
console.log(
  `plan: ${secciones.length} secciones — objetivo, alcance, fuera de alcance y criterios de entrega`,
);
