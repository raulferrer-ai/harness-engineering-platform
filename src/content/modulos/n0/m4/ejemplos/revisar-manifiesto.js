// revisar-manifiesto.js — leer y validar el package.json del proyecto (l02)
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Valida el texto del manifiesto y devuelve la lista de problemas.
 * Una lista vacía significa «el manifiesto cumple el contrato mínimo».
 */
export function revisarManifiesto(texto) {
  let manifiesto;
  try {
    manifiesto = JSON.parse(texto);
  } catch {
    throw new TypeError("revisarManifiesto espera un package.json válido (JSON)");
  }

  const problemas = [];
  if (typeof manifiesto.name !== "string" || manifiesto.name.trim() === "") {
    problemas.push("falta «name» con el nombre del paquete");
  }
  if (typeof manifiesto.version !== "string" || !/^\d+\.\d+\.\d+$/.test(manifiesto.version)) {
    problemas.push("«version» no sigue el patrón x.y.z");
  }
  if (manifiesto.type !== "module") {
    problemas.push("falta «type: module» para usar import/export");
  }
  if (!manifiesto.scripts || typeof manifiesto.scripts.test !== "string") {
    problemas.push("falta «scripts.test»");
  }
  return problemas;
}

function ejecutadoDirectamente() {
  const script = process.argv[1];
  return (
    script !== undefined && realpathSync(script) === realpathSync(fileURLToPath(import.meta.url))
  );
}

if (ejecutadoDirectamente()) {
  const manifiesto = readFileSync("proyecto/package.json", "utf8");
  const problemas = revisarManifiesto(manifiesto);
  if (problemas.length === 0) {
    console.log(
      "manifiesto OK: name, version, type: module y scripts.test presentes en proyecto/package.json",
    );
  } else {
    for (const problema of problemas) console.error(`- ${problema}`);
    process.exit(1);
  }
}
