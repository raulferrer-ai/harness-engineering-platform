// revisar-readme.js — validar que el README cumple su contrato (l06)
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Las cinco secciones mínimas que todo README de proyecto debe tener. */
export const SECCIONES_REQUERIDAS = [
  "## Qué es",
  "## Requisitos",
  "## Cómo ejecutar",
  "## Estructura",
  "## Cómo verificar",
];

/**
 * Devuelve la lista de secciones que faltan. Una lista vacía significa
 * «el README documenta lo mínimo para que otro continúe el trabajo».
 */
export function revisarReadme(texto) {
  if (typeof texto !== "string") {
    throw new TypeError("revisarReadme espera el texto del README");
  }
  return SECCIONES_REQUERIDAS.filter((seccion) => !texto.includes(seccion)).map(
    (seccion) => `falta ${seccion}`,
  );
}

function ejecutadoDirectamente() {
  const script = process.argv[1];
  return (
    script !== undefined && realpathSync(script) === realpathSync(fileURLToPath(import.meta.url))
  );
}

if (ejecutadoDirectamente()) {
  const readme = readFileSync("proyecto/README.md", "utf8");
  const problemas = revisarReadme(readme);
  if (problemas.length === 0) {
    console.log(`README OK: las ${SECCIONES_REQUERIDAS.length} secciones mínimas presentes`);
  } else {
    for (const problema of problemas) console.error(`- ${problema}`);
    process.exit(1);
  }
}
