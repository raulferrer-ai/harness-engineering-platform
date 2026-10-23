// cobertura.js — demo de l04: cada prueba con su ciclo rojo→verde.
// El registro no es prosa: sus ciclos se cruzan con los títulos del fichero
// de tests y la cobertura sólo cuenta pruebas que pasaron por rojo y verde.
import { join } from "node:path";

import { cobertura, leerRegistro } from "./tdd.js";

const dirFeature = process.argv[2] ?? "feature";
const registro = leerRegistro(join(dirFeature, "registro.json"));
const cob = cobertura(registro, join(dirFeature, "test", "contrasena.test.js"));

for (const ciclo of registro.ciclos) {
  console.log(` ${Boolean(ciclo.rojo && ciclo.verde) ? "✓" : "✗"} ${ciclo.prueba}`);
}
console.log(`cobertura rojos→verdes: ${cob.cubiertas}/${cob.total} pruebas con su ciclo`);
for (const titulo of cob.sinCiclo) console.log(`✗ prueba sin ciclo en el registro: ${titulo}`);
for (const titulo of cob.sinCerrar) console.log(`✗ prueba sin cerrar rojo y verde: ${titulo}`);
for (const titulo of cob.fueraDelSuite) {
  console.log(`✗ prueba borrada del suite, su ciclo sigue en el registro: ${titulo}`);
}

const conforme =
  cob.total > 0 && cob.cubiertas === cob.total && cob.fueraDelSuite.length === 0;
if (!conforme) process.exitCode = 1;
