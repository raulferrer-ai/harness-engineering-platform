// H15 — rojo de l02: quien revisa solo la prosa se cree la descripción.
// La descripción de informes dice «las 4 pasan»; la suite ejecutada dice otra.
import { ejecutarSuite } from "../pruebas-entrega.js";
import { entregas } from "../entregas/datos.js";

const informes = entregas.find((e) => e.id === "informes");
console.log(`descripción de la entrega: «${informes.descripcion}»`);

const suite = ejecutarSuite(`entregas/${informes.id}.test.js`);
console.log(`suite ejecutada: pass ${suite.pass} · fail ${suite.fail}`);
if (suite.fail > 0) {
  console.error(
    `claim REFUTADO: la descripción dice «las 4 pruebas pasan» pero ${suite.fail} falla`,
  );
  process.exit(1);
}
console.log("la descripción coincide con la suite");
