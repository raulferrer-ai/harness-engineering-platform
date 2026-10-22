// alcance-excedido.js — la entrega toca archivos que la tarea no permitió (l04, rojo)
// Termina en rojo a propósito: el mismo comprobador que alcance.js detecta la
// entrega que «mejoró» dos archivos de más. El diff fuera de alcance es
// código que nadie pidió, nadie revisó a fondo y nadie puede revertir limpiamente.
// Uso: node alcance-excedido.js (devuelve código 1).

import { revisarAlcance } from "../alcance.js";

const tarea = {
  id: "tarea-2",
  instruccion:
    "Corrige el redondeo de la suma en src/gastos.js: la función total debe redondear a 2 decimales al final, no cada línea.",
  archivosPermitidos: ["src/gastos.js"],
};

// La entrega típica del asistente entusiasta: corrige lo pedido y además
// toca el informe, los tests y el README sin que nadie se lo pidiera.
const entrega = {
  archivosTocados: ["src/gastos.js", "src/informe.js", "test/gastos.test.js", "README.md"],
};

console.log(`archivos permitidos por la tarea: ${tarea.archivosPermitidos.join(", ")}`);
console.log(`archivos tocados por la entrega:  ${entrega.archivosTocados.join(", ")}`);

const fuera = revisarAlcance(tarea.archivosPermitidos, entrega.archivosTocados);

for (const archivo of fuera) {
  console.error(`✗ fuera del alcance: ${archivo}`);
}

if (fuera.length > 0) {
  console.error(`alcance refutado: ${fuera.length} de ${entrega.archivosTocados.length} archivos tocados no estaban permitidos`);
  process.exit(1);
}

console.log("alcance respetado.");
