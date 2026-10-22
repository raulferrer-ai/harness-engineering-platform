// plausible-erroneo.js — demo de l03: ejecutar el caso límite declarado.
// Las tres funciones de fallos/casos.js son plausibles: cada una pasa en el
// uso normal y falla sólo en su borde. El detector las ejecuta con la entrada
// declarada en fallos.json y compara el resultado con lo esperado.
import { DETECTORES, RUTA_COLECCION, leerColeccion } from "./fallos.js";

const ruta = process.argv[2] ?? RUTA_COLECCION;
const { fallos } = leerColeccion(ruta);
const entradas = fallos.filter((fallo) => fallo.tipo === "codigo-erroneo");

console.log(`probando ${entradas.length} funciones plausibles en su caso límite (${ruta}):`);
let confirmados = 0;
const detector = DETECTORES["codigo-erroneo"];
for (const fallo of entradas) {
  const { ok, detalle } = await detector(fallo.comprobacion);
  if (ok) confirmados += 1;
  console.log(` ${ok ? "✗" : "✓"} ${fallo.id} — ${fallo.titulo} — ${detalle}`);
}

console.log(
  `${entradas.length} funciones plausibles con fallo en casos límite — ${confirmados} de ${entradas.length} confirmados por ejecución`,
);
if (confirmados !== entradas.length) {
  process.exitCode = 1;
}
