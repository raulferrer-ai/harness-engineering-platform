// golden.js — demo de l03: la implementación contra los golden cases de la spec.
// La implementación no se juzga por parecer bien escrita: se ejecutan los
// ejemplos de la spec (golden cases) contra ella y se comparan con sus
// esperados. Los criterios incumplidos salen con su discrepancia.
import { ejecutarCriterios, leerSpec } from "./ciclo.js";

const dir = process.argv[2] ?? "proyecto";
const spec = leerSpec(`${dir}/spec.md`);
console.log(`comprobando ${dir}/ contra los golden cases de la spec:`);
const resultados = await ejecutarCriterios(spec, dir);
let cumplidos = 0;
for (const resultado of resultados) {
  if (resultado.ok) cumplidos += 1;
  console.log(` ${resultado.ok ? "✓" : "✗"} ${resultado.detalle}`);
}
console.log(
  `implementación conforme: ${spec.funcion} exportada; ${cumplidos} de ${resultados.length} golden cases cumplidos`,
);
process.exitCode = cumplidos === resultados.length ? 0 : 1;
