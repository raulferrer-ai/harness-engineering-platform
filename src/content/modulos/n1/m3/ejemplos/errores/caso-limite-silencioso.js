// H15 — rojo de l04: el caso límite de la lista vacía devuelve basura en silencio.
// Sin la batería de la tarea, nadie ve que «top» sale -Infinity y «media» NaN.
import { resumen } from "../entregas/informes-despues.js";

console.log("caso límite de la tarea: resumen de lista vacía → { top: null, media: 0 }");
const resultado = resumen([]);
console.log(`lo que devuelve la entrega: top=${resultado.top}, media=${resultado.media}`);
if (resultado.top === null && resultado.media === 0) {
  console.log("caso límite correcto");
} else {
  console.error("DEVOLVER: el caso límite devuelve valores incorrectos en silencio");
  process.exit(1);
}
