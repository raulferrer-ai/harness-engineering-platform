// detectar.js — demo de l05: el runner de la colección personal.
// Ejecuta todos los detectores de fallos/fallos.json y decide con dos códigos
// de salida: 0 si los N fallos declarados están todos confirmados, 1 si alguno
// queda sin comprobar (sólo en papel) o su comprobación ya no lo confirma.
import { RUTA_COLECCION, detectarColeccion, plural } from "./fallos.js";

const ruta = process.argv[2] ?? RUTA_COLECCION;
const { total, detectados, incidencias, lineas } = await detectarColeccion(ruta);

console.log(`ejecutando detectores de ${ruta}:`);
for (const linea of lineas) {
  console.log(linea);
}
for (const incidencia of incidencias) {
  console.log(` ✗ ${incidencia}`);
}

if (incidencias.length === 0) {
  console.log(
    `${plural(detectados, "fallo", "fallos")} detectados, 0 sin detectar — la colección queda certificada`,
  );
} else {
  console.log(
    `${plural(detectados, "fallo", "fallos")} detectados, ${plural(incidencias.length, "sin detectar", "sin detectar")} — el runner no da la colección por buena`,
  );
  process.exitCode = 1;
}
