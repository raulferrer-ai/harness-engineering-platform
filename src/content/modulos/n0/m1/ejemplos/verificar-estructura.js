// verificar-estructura.js — comprueba que un proyecto tiene la estructura mínima
// Uso: node verificar-estructura.js [ruta-del-proyecto]  (por defecto, el directorio actual)
import { existsSync } from "node:fs";
import { join } from "node:path";

const raiz = process.argv[2] ?? ".";
const requeridos = ["src/principal.js", "pruebas/principal.test.js", "README.md"];

const faltantes = requeridos.filter((relativa) => !existsSync(join(raiz, relativa)));

if (faltantes.length === 0) {
  console.log(`OK: estructura completa en ${raiz} (${requeridos.length} elementos).`);
} else {
  console.error(`Faltan ${faltantes.length} elementos:`);
  for (const faltante of faltantes) console.error(`  - ${faltante}`);
  process.exit(1);
}
