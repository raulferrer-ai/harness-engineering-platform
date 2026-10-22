// H16 (l02) — una sesión de chat que acaba con «listo» y sin ejecutar nada.
// El analizador no acepta promesas: exige comando, «fail 0» y código 0.
import { pathToFileURL } from "node:url";

import { analizarChat } from "../analizar-chat.js";

const TRANSCRIPCION_ROTA = `# Sesión sX — chat

objetivo: arreglar la función total

contexto: devuelve texto y la lista vacía revienta

propuesta del asistente:

~~~js
export function total(importes) {
  if (importes.length === 0) return 0;
  const suma = importes.reduce((acumulado, importe) => acumulado + importe, 0);
  return Math.round(suma * 100) / 100;
}
~~~

listo, ya está hecho ✅
`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { incidencias } = analizarChat(TRANSCRIPCION_ROTA);
  if (incidencias.length > 0) {
    console.error(`chat NO válido: ${incidencias.length} incidencia(s): ${incidencias.join(" | ")}`);
    process.exit(1);
  }
  console.log("no debería llegar aquí: la sesión no ejecutó nada");
}
