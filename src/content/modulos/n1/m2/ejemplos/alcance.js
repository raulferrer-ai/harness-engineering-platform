// alcance.js — la tarea declara los archivos que la entrega puede tocar (l04)
//
// Acotar el alcance es poner fronteras explícitas: la tarea lista los archivos
// permitidos y la entrega solo puede tocar esos archivos. Un asistente sin
// fronteras «mejora» módulos que nadie le pidió tocar y agranda el diff hasta
// hacerlo irrevisable (m0/m4, n1/m3).
//
// Uso: node alcance.js

/** Comprueba que la entrega solo toca archivos permitidos. */
export function revisarAlcance(archivosPermitidos, archivosTocados) {
  const permitidos = new Set(archivosPermitidos);
  return archivosTocados.filter((archivo) => !permitidos.has(archivo));
}

const tarea = {
  id: "tarea-2",
  instruccion:
    "Corrige el redondeo de la suma en src/gastos.js: la función total debe redondear a 2 decimales al final, no cada línea.",
  archivosPermitidos: ["src/gastos.js"],
};

const entrega = {
  archivosTocados: ["src/gastos.js"],
};

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("alcance.js")) {
  console.log(`archivos permitidos por la tarea: ${tarea.archivosPermitidos.join(", ")}`);
  console.log(`archivos tocados por la entrega:  ${entrega.archivosTocados.join(", ")}`);

  const fuera = revisarAlcance(tarea.archivosPermitidos, entrega.archivosTocados);

  if (fuera.length > 0) {
    for (const archivo of fuera) console.error(`✗ fuera del alcance: ${archivo}`);
    console.error(`alcance refutado: ${fuera.length} archivo(s) no permitido(s)`);
    process.exit(1);
  }

  console.log(
    `✓ alcance respetado: 1 archivo tocado, dentro de los ${tarea.archivosPermitidos.length} permitidos`,
  );
}
