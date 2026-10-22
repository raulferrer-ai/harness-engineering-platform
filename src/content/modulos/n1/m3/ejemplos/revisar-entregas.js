// H15 (l06) — el entregable: el checklist aplicado a las tres entregas.
// Un veredicto por entrega con sus incidencias y el resumen de la revisión.
import { pathToFileURL } from "node:url";

import { revisarEntrega } from "./checklist.js";
import { entregas } from "./entregas/datos.js";

const resumen = { ACEPTAR: 0, DEVOLVER: 0 };

console.log(`revisión de ${entregas.length} entregas con el checklist de 4 criterios`);
for (const entrega of entregas) {
  const { incidencias, veredicto } = await revisarEntrega(entrega);
  resumen[veredicto]++;
  const marca = veredicto === "ACEPTAR" ? "✓" : "✗";
  if (veredicto === "ACEPTAR") {
    console.log(`${marca} ACEPTAR  ${entrega.id.padEnd(10)} (0 incidencias)`);
  } else {
    const detalle = incidencias.map((i) => `${i.nombre}: ${i.detalle}`).join(" | ");
    console.log(`${marca} DEVOLVER ${entrega.id.padEnd(10)} (${incidencias.length} incidencia(s))`);
    console.log(`     ↳ ${detalle}`);
  }
}

console.log(`resumen: ${resumen.ACEPTAR} aceptada(s), ${resumen.DEVOLVER} devuelta(s)`);
