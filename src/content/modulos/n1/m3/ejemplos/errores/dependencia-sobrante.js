// H15 — rojo de l03: la entrega añade una dependencia que su código no usa.
import { codigoImporta, dependenciasNuevas } from "../dependencias.js";
import { entregas } from "../entregas/datos.js";

const fechas = entregas.find((e) => e.id === "fechas");
for (const dependencia of dependenciasNuevas(fechas)) {
  const usado = codigoImporta(fechas.id, dependencia);
  console.log(
    `nueva dependencia declarada: «${dependencia}» — ${usado ? "el código la usa" : "el código NO la importa"}`,
  );
  if (!usado) {
    console.error(
      `DEVOLVER: «${dependencia}» no aparece en el código de la entrega (sobrante en el manifiesto)`,
    );
    process.exit(1);
  }
}
console.log("todas las dependencias nuevas se usan en el código");
