// fallo-sin-deteccion.js — rojo de l05: un fallo declarado sin comprobación
// (el runner sale con 1). Añade f11 al fallos.json de una copia sin ningún
// detector asociado: el runner no puede confirmarlo y se niega a dar la
// colección por buena. La lección: un fallo sin detección es sólo una
// sospecha; para vivir en la colección necesita su comprobación.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { detectarColeccion } from "../fallos.js";

const DIR_EJEMPLOS = dirname(dirname(fileURLToPath(import.meta.url)));

const dir = mkdtempSync(join(tmpdir(), "n1m6-rojo-sin-deteccion-"));
try {
  cpSync(join(DIR_EJEMPLOS, "fallos"), join(dir, "fallos"), { recursive: true });
  const ruta = join(dir, "fallos", "fallos.json");
  const datos = JSON.parse(readFileSync(ruta, "utf8"));
  datos.fallos.push({
    id: "f11",
    tipo: "codigo-erroneo",
    titulo: "sin comprobación asociada",
    ejemplo: "return texto.charAt(0);",
    deteccion: "alguna comprobación que alguien escribirá mañana",
  });
  writeFileSync(ruta, `${JSON.stringify(datos, null, 2)}\n`);

  const { incidencias } = await detectarColeccion(ruta);
  for (const incidencia of incidencias) {
    console.log(`✗ ${incidencia}`);
  }
  console.log("el runner no da por buena una colección con fallos que nadie sabe detectar");
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
