// H16 (l06) — el entregable: «Registro de 5 sesiones con verificación».
// Un solo comando emite el veredicto final del entregable, o su devolución.
import { pathToFileURL, fileURLToPath } from "node:url";

import { CAMPOS, SUPERFICIES, anatomia, cargarRegistro } from "./sesiones.js";
import { verificarRegistro } from "./comprobar-registro.js";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ruta = process.argv[2] ?? fileURLToPath(new URL("./sesiones/registro.json", import.meta.url));

  const { incidencias: incidenciasAnatomia, conteo } = anatomia(cargarRegistro(ruta));
  const { incidencias, detalles } = verificarRegistro(ruta);
  const incidenciasTotales = [...new Set([...incidenciasAnatomia, ...incidencias])];

  if (incidenciasTotales.length > 0) {
    console.error(`entregable NO válido: ${incidenciasTotales.length} incidencia(s)`);
    for (const incidencia of incidenciasTotales) console.error(`  - ${incidencia}`);
    process.exit(1);
  }

  const pruebas = detalles.reduce((total, d) => total + d.pass, 0);
  console.log(
    `campos: ${detalles.length} de ${detalles.length} sesiones completas con sus ${CAMPOS.length} campos`,
  );
  console.log(
    `superficies: chat ${conteo.chat} · inline ${conteo.inline} · terminal ${conteo.terminal} (de ${SUPERFICIES.join(", ")})`,
  );
  console.log(
    `comandos reejecutados: ${detalles.length} de ${detalles.length} con el código declarado`,
  );
  console.log(`pruebas en verde: ${pruebas} (0 en rojo)`);
  console.log("entregable válido: registro de 5 sesiones con verificación");
}
