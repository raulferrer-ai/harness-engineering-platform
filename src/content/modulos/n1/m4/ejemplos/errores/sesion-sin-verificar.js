// H16 (l05) — una sesión que se declara «verificada» con código de salida 1.
// El registro no lo tolera: el veredicto se reejecuta y se compara.
import { fileURLToPath, pathToFileURL } from "node:url";

import { verificarRegistro } from "../comprobar-registro.js";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ruta = fileURLToPath(new URL("./registro-sin-verificar.json", import.meta.url));
  const { incidencias } = verificarRegistro(ruta);
  if (incidencias.length === 0) {
    console.log("registro sin verificar corregido: ninguna incidencia");
    process.exit(0);
  }
  console.error(`registro NO válido: ${incidencias.length} incidencia(s)`);
  for (const incidencia of incidencias) console.error(`  - ${incidencia}`);
  process.exit(1);
}
