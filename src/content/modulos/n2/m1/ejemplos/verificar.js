// verificar.js — demo de l04: la verificación cierra el contrato por dos vías.
// Los criterios de la spec se ejecutan contra la implementación y la suite
// corre con el test runner de Node. Las dos luces tienen que estar en verde:
// la spec dice qué se prometió, la suite prueba cómo se prueba.
import { ejecutarCriterios, ejecutarSuite, leerSpec } from "./ciclo.js";

const dir = process.argv[2] ?? "proyecto";
const spec = leerSpec(`${dir}/spec.md`);
console.log(`verificando ${dir} (criterios de spec.md + node --test):`);
const resultados = await ejecutarCriterios(spec, dir);
let cumplidos = 0;
for (const resultado of resultados) {
  if (resultado.ok) cumplidos += 1;
  console.log(` ${resultado.ok ? "✓" : "✗"} ${resultado.detalle}`);
}
const suite = ejecutarSuite(dir);
console.log(
  ` suite: ${suite.pruebas} pruebas, ${suite.fallos} fallos (node --test terminó con ${suite.status})`,
);
const cerrado = cumplidos === resultados.length && suite.status === 0;
console.log(
  cerrado
    ? `verificación: ${cumplidos} criterios cumplidos, ${suite.pruebas} pruebas en verde — el contrato está cerrado`
    : `verificación: ${resultados.length - cumplidos} criterios sin cumplir y ${suite.fallos} pruebas en rojo — el contrato está abierto`,
);
process.exitCode = cerrado ? 0 : 1;
