// l05 · Demo: la suite verde que no fija nada. El camino «zona desconocida»
// no está cubierto por ninguna prueba: se supone (mal), se observa (bien) y
// se fija con una prueba de caracterización. Copia el fixture a un temporal.

import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { correrSuite } from "./refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const taller = mkdtempSync(join(tmpdir(), "hep-m3-"));
cpSync(join(aqui, "fixture"), join(taller, "fixture"), { recursive: true });

const carpeta = join(taller, "fixture");
const suite = join(carpeta, "test");
const arranque = correrSuite(suite);
console.log(`suite inicial: ${arranque.verdes}/${arranque.pruebas} en verde — pero ninguna prueba menciona una zona fuera de las tres tarifas`);

// Observar qué hace realmente el código con una zona que nadie fijó.
const observado = spawnSync(
  process.execPath,
  ["--input-type=module", "-e", 'import { costeEnvio } from "./envios.js"; console.log(costeEnvio({ peso: 1, zona: "luna" }));'],
  { cwd: carpeta, encoding: "utf8" },
);
const valor = observado.stdout.trim();

const prueba = (cifra) =>
  `import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport { costeEnvio } from "../envios.js";\n\ntest("caracterización: una zona desconocida se cobra como internacional", () => {\n  assert.strictEqual(costeEnvio({ peso: 1, zona: "luna" }), ${cifra});\n});\n`;

// 1) Suposición: se escribe la prueba desde lo que se cree recordar.
writeFileSync(join(suite, "caracterizacion.test.js"), prueba("9.5"));
const supuesto = correrSuite(suite);
console.log(`suposición: «la zona desconocida costaría 9.5» → suite ${supuesto.verdes}/${supuesto.pruebas}, ${supuesto.fallos} fallo — el supuesto está en rojo`);

// 2) Lectura: se observa el comportamiento real y se fija con ese valor.
writeFileSync(join(suite, "caracterizacion.test.js"), prueba(valor));
const cerrado = correrSuite(suite);
console.log(`caracterización: el código cobra ${valor} → suite ${cerrado.verdes}/${cerrado.pruebas} — ${cerrado.status === 0 ? "en verde" : "EN ROJO"}`);
console.log("hueco cerrado: el camino «zona desconocida» ya no depende de lo que nadie recuerde — está fijado por una prueba");

rmSync(taller, { recursive: true, force: true });
process.exitCode = arranque.status === 0 && supuesto.status === 1 && cerrado.status === 0 ? 0 : 1;
