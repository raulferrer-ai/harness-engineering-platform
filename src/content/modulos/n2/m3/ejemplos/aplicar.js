// l04 · Demo: el catálogo aplicado sobre una copia — constantes nombradas y
// extracción de función — con la suite verde y la comparación de métricas al
// final. El fixture original queda intacto.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { comparar, correrSuite, medir, OLOR } from "./refactor.js";

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

const antes = medir(ruta);

// Entrada del catálogo «nombrar cifras»: números mágicos → constantes.
parchear("3.5", "TARIFA_BASE_NACIONAL");
parchear("5.9", "TARIFA_BASE_EUROPEA");
parchear("9.9", "TARIFA_BASE_INTERNACIONAL");
parchear("1.5", "FACTOR_EXPRESS");
parchear(
  "export function costeEnvio(pedido) {",
  "const TARIFA_BASE_NACIONAL = 3.5;\nconst TARIFA_BASE_EUROPEA = 5.9;\nconst TARIFA_BASE_INTERNACIONAL = 9.9;\nconst FACTOR_EXPRESS = 1.5;\n\nexport function costeEnvio(pedido) {",
);

// Entrada del catálogo «extraer función»: el tramo ligero pasa a tener nombre.
parchear(
  "  if (pedido.peso <= 1) {\n    if (pedido.zona === \"nacional\") {\n      total = total + TARIFA_BASE_NACIONAL;\n    } else if (pedido.zona === \"europea\") {\n      total = total + TARIFA_BASE_EUROPEA;\n    } else {\n      total = total + TARIFA_BASE_INTERNACIONAL;\n    }\n  } else if (pedido.peso <= 5) {",
  "  if (pedido.peso <= 1) {\n    total = total + tramoLigero(pedido);\n  } else if (pedido.peso <= 5) {",
);
parchear(
  "const TARIFA_BASE_NACIONAL = 3.5;",
  "function tramoLigero(pedido) {\n  if (pedido.zona === \"nacional\") {\n    return TARIFA_BASE_NACIONAL;\n  }\n  if (pedido.zona === \"europea\") {\n    return TARIFA_BASE_EUROPEA;\n  }\n  return TARIFA_BASE_INTERNACIONAL;\n}\n\nconst TARIFA_BASE_NACIONAL = 3.5;",
);

const corrida = correrSuite(suite);
const despues = medir(ruta);
const veredicto = comparar(
  Object.fromEntries(OLOR.map((clave) => [clave, antes[clave]])),
  Object.fromEntries(OLOR.map((clave) => [clave, despues[clave]])),
);
console.log(`catálogo aplicado: nombrar cifras + extraer tramoLigero(pedido) → suite ${corrida.verdes}/${corrida.pruebas} — ${corrida.status === 0 ? "en verde" : "EN ROJO"}`);
console.log(
  `métricas: función más larga ${antes.funcionMasLarga}→${despues.funcionMasLarga}, números mágicos ${antes.numerosMagicos}→${despues.numerosMagicos}, duplicadas ${antes.lineasDuplicadas}→${despues.lineasDuplicadas}, líneas ${antes.lineas}→${despues.lineas}`,
);
console.log(
  `veredicto: ${veredicto.mejora && corrida.status === 0 ? "mejora sin regresiones — la suite siguió verde" : "revisar: algo subió o la suite cayó"}`,
);

rmSync(taller, { recursive: true, force: true });
process.exitCode = 0;
