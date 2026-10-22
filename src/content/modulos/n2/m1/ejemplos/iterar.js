// iterar.js — demo de l05: el ciclo rojo → verde sobre una copia del proyecto.
// La spec crece (C5: el importe negativo se rechaza) y el ciclo entero la
// sigue: primero el criterio incumple (rojo), después parchean la
// implementación y la suite (verde) sin romper los criterios anteriores.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));

const C5 = `
### C5 · el importe negativo se rechaza
entrada: [[{"importe": -1, "impuesto": 0, "descuento": 0}]]
esperado: {"error": "RangeError"}`;

// La verificación corre en un proceso hijo: cada iteración importa la
// implementación desde su propio estado, sin la caché de módulos del padre.
const VERIFICACION = [
  'import { ejecutarCriterios, ejecutarSuite, leerSpec } from "./ciclo.js";',
  'const spec = leerSpec("proyecto/spec.md");',
  'const resultados = await ejecutarCriterios(spec, "proyecto");',
  "const incumplidos = resultados.filter((r) => !r.ok);",
  'const suite = ejecutarSuite("proyecto");',
  'console.log(`criterios: ${resultados.length - incumplidos.length}/${resultados.length} cumplidos — suite: ${suite.pruebas} pruebas, ${suite.fallos} fallos`);',
  "for (const i of incumplidos) console.log(` ✗ ${i.detalle}`);",
  "process.exitCode = incumplidos.length === 0 && suite.status === 0 ? 0 : 1;",
].join("\n");

function verificar(carpeta) {
  return spawnSync(process.execPath, ["--input-type=module", "-e", VERIFICACION], {
    cwd: carpeta,
    encoding: "utf8",
    timeout: 60_000,
  });
}

const taller = mkdtempSync(join(tmpdir(), "n2m1-iterar-"));
try {
  cpSync(join(DIR_EJEMPLOS, "proyecto"), join(taller, "proyecto"), { recursive: true });
  cpSync(join(DIR_EJEMPLOS, "ciclo.js"), join(taller, "ciclo.js"));

  // Iteración 1: la spec crece; la implementación todavía no la sigue.
  const specPath = join(taller, "proyecto", "spec.md");
  writeFileSync(specPath, `${readFileSync(specPath, "utf8")}\n${C5}\n`);
  const rojo = verificar(taller);
  console.log("iteración 1: C5 declarado en la spec → rojo (la implementación no lo cumple aún)");
  process.stdout.write(rojo.stdout);

  // Iteración 2: parchean implementación y suite; el ciclo vuelve a verde.
  const implPath = join(taller, "proyecto", "presupuesto.js");
  writeFileSync(
    implPath,
    readFileSync(implPath, "utf8").replace(
      "  for (const { importe, impuesto = 0, descuento = 0 } of lineas) {",
      "  for (const { importe, impuesto = 0, descuento = 0 } of lineas) {\n    if (importe < 0) throw new RangeError(`importe negativo: ${importe}`);",
    ),
  );
  const testPath = join(taller, "proyecto", "test", "presupuesto.test.js");
  writeFileSync(
    testPath,
    `${readFileSync(testPath, "utf8")}\ntest("C5 · el importe negativo se rechaza", () => {\n  assert.throws(() => totalFactura([{ importe: -1, impuesto: 0, descuento: 0 }]), RangeError);\n});\n`,
  );
  const verde = verificar(taller);
  console.log("iteración 2: parche en presupuesto.js y test C5 añadido → verde");
  process.stdout.write(verde.stdout);

  console.log(
    "ciclo completo: rojo → verde — la spec creció y la implementación la siguió sin romper lo anterior",
  );
  process.exitCode = verde.status === 0 && rojo.status === 1 ? 0 : 1;
} finally {
  rmSync(taller, { recursive: true, force: true });
}
