// tarea-ambigua.js — una instrucción vaga sin entregable ni criterios (l01, rojo)
// Termina en rojo a propósito: la misma comprobación de anatomía que anatomia.js
// rechaza la tarea que un asistente NO puede resolver de forma verificable.
// Uso: node tarea-ambigua.js (devuelve código 1).

import { revisarAnatomia } from "../anatomia.js";

const tarea = {
  id: "tarea-ambigua",
  instruccion: "Arregla el login.",
  entregable: "",
  criterios: ["que funcione bien"],
};

const incidencias = revisarAnatomia(tarea);

for (const incidencia of incidencias) {
  console.error(`✗ ${tarea.id}: ${incidencia}`);
}

if (incidencias.length > 0) {
  console.error(
    "tarea no formulable: un asistente tendría que adivinar qué entregar y cuándo parar",
  );
  process.exit(1);
}

console.log("tarea válida.");
