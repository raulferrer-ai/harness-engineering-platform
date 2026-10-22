// comprobar-api.js — demo de l02: verificar un símbolo propuesto, sin red.
// Recorre las entradas tipo api-inexistente de la colección y comprueba cada
// símbolo contra la librería estándar con un import dinámico. Dos controles
// reales acompañan a las APIs inventadas para demostrar que el detector no
// acusa a lo que sí existe.
import { DETECTORES, RUTA_COLECCION, leerColeccion } from "./fallos.js";

// Controles reales: símbolos que sí están exportados por su módulo.
const CONTROLES = [
  { modulo: "node:fs", simbolo: "promises", nota: "control real (la alternativa a readFileAsync)" },
  { modulo: "node:crypto", simbolo: "createHash", nota: "control real (la alternativa a md5)" },
];

const ruta = process.argv[2] ?? RUTA_COLECCION;
const { fallos } = leerColeccion(ruta);
const entradas = fallos.filter((fallo) => fallo.tipo === "api-inexistente");

console.log(`verificando ${entradas.length} APIs propuestas contra la librería estándar (${ruta}):`);
let inventadas = 0;
const detector = DETECTORES["api-inexistente"];
for (const fallo of entradas) {
  const { ok, detalle } = await detector(fallo.comprobacion);
  if (ok) inventadas += 1;
  console.log(` ${ok ? "✗" : "✓"} ${fallo.id} — ${fallo.titulo} — ${detalle}`);
}

console.log(`controles reales (${CONTROLES.length}):`);
let reales = 0;
for (const { modulo, simbolo, nota } of CONTROLES) {
  const moduloReal = await import(modulo);
  const existe = typeof moduloReal[simbolo] !== "undefined";
  if (existe) reales += 1;
  console.log(
    ` ${existe ? "✓" : "✗"} ${modulo}.${simbolo} ${existe ? "existe" : "no existe"} — ${nota}`,
  );
}

console.log(
  `${inventadas} APIs inventadas, ${reales} reales — la verificación es offline y no depende de la memoria del asistente`,
);
if (inventadas !== entradas.length || reales !== CONTROLES.length) {
  process.exitCode = 1;
}
