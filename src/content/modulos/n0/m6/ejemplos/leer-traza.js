// leer-traza.js — anatomía de un stack: localizar el primer frame de TU código (lección l05)
function principal() {
  return mediate();
}

function mediate() {
  return interna({ articulos: null });
}

function interna(datos) {
  // El fallo real está aquí: contar sobre null.
  return datos.articulos.length;
}

try {
  principal();
} catch (error) {
  console.log("clase:", error.name);
  console.log("mensaje:", error.message);

  const frames = error.stack.split("\n").slice(1).filter((linea) => linea.trim().startsWith("at "));
  console.log("frames en la pila:", frames.length);

  const propios = frames.filter((frame) => !frame.includes("node:internal"));
  console.log("primer frame de TU código:", extraerFuncion(propios[0]));

  for (const frame of frames.slice(0, 3)) {
    console.log("  frame:", extraerFuncion(frame), "→", base(frame));
  }
}

/** `at nombre (ruta:línea:col)` → nombre; `at ruta:línea:col` → "(módulo)". */
function extraerFuncion(frame) {
  const coincidencia = frame.match(/at ([^(]+) \(/);
  return coincidencia ? coincidencia[1].trim() : "(módulo)";
}

/** Solo el nombre del fichero del frame, para que la salida sea portable. */
function base(frame) {
  const ruta = frame.match(/\((.*):\d+:\d+\)/);
  return ruta ? ruta[1].split("/").pop() : "?";
}
