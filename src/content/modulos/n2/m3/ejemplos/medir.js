// l02 · Demo: medir antes y después. Las métricas hacen el «antes/después»
// falsificable: se miden los dos ficheros del fixture y se comparan sus
// cifras — el veredicto es un dato, no una impresión.

import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { OLOR, comparar, medir } from "./refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const antes = medir(join(aqui, "fixture", "envios.js"));
const despues = medir(join(aqui, "fixture", "despues.js"));

const resumir = (m) =>
  `líneas ${m.lineas} · función más larga ${m.funcionMasLarga} · números mágicos ${m.numerosMagicos} · anidamiento ${m.anidamientoMax} · duplicadas ${m.lineasDuplicadas}`;

console.log(`métricas antes:   ${resumir(antes)}`);
console.log(`métricas después: ${resumir(despues)}`);

const veredicto = comparar(
  Object.fromEntries(OLOR.map((clave) => [clave, antes[clave]])),
  Object.fromEntries(OLOR.map((clave) => [clave, despues[clave]])),
);
console.log(`comparar: bajan ${veredicto.mejoran.join(", ")} — ninguna sube (las líneas se reportan pero no puntúan)`);
console.log(
  `veredicto: ${veredicto.mejora ? "mejora" : "no mejora"} — el antes/después son cifras medidas, no una sensación`,
);
