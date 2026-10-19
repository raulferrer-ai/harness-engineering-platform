// comprobar-entorno.js — comprueba que tu versión de Node coincide con la esperada
// Uso: node comprobar-entorno.js [ruta-del-fichero-de-versiones]
import { readFileSync } from "node:fs";

const rutaVersiones = process.argv[2] ?? "versiones-esperadas.txt";
const lineas = readFileSync(rutaVersiones, "utf8")
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea !== "" && !linea.startsWith("#"));

const esperadas = new Map(
  lineas.map((linea) => {
    const [clave, valor] = linea.split("=");
    if (!clave || !valor) {
      throw new Error(`Línea inválida en ${rutaVersiones}: «${linea}» (formato clave=valor)`);
    }
    return [clave.trim(), valor.trim()];
  }),
);

const instalada = process.versions.node;
const esperada = esperadas.get("node");

if (!esperada) {
  console.error(`Falta la clave «node» en ${rutaVersiones}`);
  process.exit(1);
}

if (instalada === esperada) {
  console.log(`OK: Node ${instalada} coincide con la versión esperada.`);
} else {
  console.error(`Distinta: instalada ${instalada}, esperada ${esperada}.`);
  console.error("Revisa la instalación (lección l02) antes de continuar.");
  process.exit(1);
}
