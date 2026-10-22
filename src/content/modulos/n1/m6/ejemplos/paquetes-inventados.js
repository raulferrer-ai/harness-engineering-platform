// paquetes-inventados.js — demo de l04: package.json frente a package-lock.json.
// Cada dependencia declarada se contrasta con el lock: lo que no aparece
// resuelto nunca llegó a instalarse porque no está publicado. Comparar los dos
// ficheros es la comprobación offline de que un paquete existe o no.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plural } from "./fallos.js";

const DIR_PROYECTO = join(dirname(fileURLToPath(import.meta.url)), "proyecto");
const dirProyecto = process.argv[2] ?? DIR_PROYECTO;

const manifiesto = JSON.parse(readFileSync(join(dirProyecto, "package.json"), "utf8"));
const bloqueo = JSON.parse(readFileSync(join(dirProyecto, "package-lock.json"), "utf8"));
const declaradas = Object.keys(manifiesto.dependencies ?? {});

console.log(`dependencias declaradas en ${dirProyecto}/package.json:`);
let inventadas = 0;
let resueltas = 0;
for (const paquete of declaradas) {
  const resolucion = bloqueo.packages?.[`node_modules/${paquete}`];
  if (resolucion) {
    resueltas += 1;
    console.log(` ✓ ${paquete} — resuelta en el lock (versión ${resolucion.version})`);
  } else {
    inventadas += 1;
    console.log(` ✗ ${paquete} — declarada, ausente del lock — nunca se instaló`);
  }
}

console.log(
  `${plural(inventadas, "inventada", "inventadas")}, ${plural(resueltas, "resuelta", "resueltas")} en el lock — sólo lo resuelto en el lock es instalable`,
);

// La raíz del lock (packages[""]) copia las dependencias declaradas: si no
// coincide con package.json, alguien editó el manifiesto a mano y el lock
// quedó desactualizado (sólo npm install lo reescribe, y sin red no hay
// install). Ésta es la única inconsistencia que el presentador considera roja.
const raiz = Object.keys(bloqueo.packages?.[""]?.dependencies ?? {});
const sinEnRaiz = declaradas.filter((paquete) => !raiz.includes(paquete));
const sobranEnRaiz = raiz.filter((paquete) => !declaradas.includes(paquete));
if (sinEnRaiz.length > 0 || sobranEnRaiz.length > 0) {
  if (sinEnRaiz.length > 0) {
    console.log(` ✗ package.json y el lock no coinciden — falta en la raíz del lock: ${sinEnRaiz.join(", ")}`);
  }
  if (sobranEnRaiz.length > 0) {
    console.log(` ✗ package.json y el lock no coinciden — sobra en la raíz del lock: ${sobranEnRaiz.join(", ")}`);
  }
  console.log("el manifiesto se editó a mano: sólo npm install actualiza el lock");
  process.exitCode = 1;
}
