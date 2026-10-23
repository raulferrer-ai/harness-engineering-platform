// l03 · Demo: el protocolo de pasos pequeños. Cada paso es un cambio
// verificable: se aplica uno, se corre la suite y sólo entonces se pasa al
// siguiente. Copia el fixture a un temporal; el original queda intacto.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { correrSuite, medir } from "./refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const taller = mkdtempSync(join(tmpdir(), "hep-m3-"));
cpSync(join(aqui, "fixture"), join(taller, "fixture"), { recursive: true });

const ruta = join(taller, "fixture", "envios.js");
const suite = join(taller, "fixture", "test");

function parchear(antes, despues) {
  const texto = readFileSync(ruta, "utf8");
  const cambiado = texto.replaceAll(antes, despues);
  if (cambiado === texto) throw new Error(`el patrón no casó: ${antes.slice(0, 40)}`);
  writeFileSync(ruta, cambiado);
}

const arranque = correrSuite(suite);
const antes = medir(ruta);

// Paso 1: extraer el redondeo.
parchear("  return Math.round(total * 100) / 100;\n}", "  return redondear(total);\n}");
parchear(
  "export function costeEnvio(pedido) {",
  "function redondear(valor) {\n  return Math.round(valor * 100) / 100;\n}\n\nexport function costeEnvio(pedido) {",
);
const paso1 = correrSuite(suite);
console.log(`paso 1: extraer redondear(valor) → suite ${paso1.verdes}/${paso1.pruebas} — ${paso1.status === 0 ? "en verde" : "EN ROJO"}`);

// Paso 2: extraer el recargo express.
parchear("  if (pedido.express) {\n    total = total * 1.5;\n  }", "  total = aplicarExpress(total, pedido.express);");
parchear(
  "export function costeEnvio(pedido) {",
  "function aplicarExpress(total, express) {\n  return express ? total * 1.5 : total;\n}\n\nexport function costeEnvio(pedido) {",
);
const paso2 = correrSuite(suite);
console.log(`paso 2: extraer aplicarExpress(total, express) → suite ${paso2.verdes}/${paso2.pruebas} — ${paso2.status === 0 ? "en verde" : "EN ROJO"}`);

const m = medir(ruta);
console.log(
  `métricas: función más larga ${antes.funcionMasLarga}→${m.funcionMasLarga}, duplicadas ${antes.lineasDuplicadas}→${m.lineasDuplicadas}, líneas ${antes.lineas}→${m.lineas}`,
);
console.log(
  arranque.status === 0 && paso1.status === 0 && paso2.status === 0
    ? "protocolo: la suite corrió tras cada paso y siguió verde — el paso 3 lo haces en el ejercicio"
    : "protocolo roto: si un paso deja la suite en rojo, no se avanza",
);

rmSync(taller, { recursive: true, force: true });
process.exitCode = 0;
