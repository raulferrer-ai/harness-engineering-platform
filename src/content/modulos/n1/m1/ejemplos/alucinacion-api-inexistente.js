// alucinacion-api-inexistente.js — por qué el modelo "inventa" (l02)
//
// Idea central: el modelo NO consulta una base de datos de hechos; predice la
// secuencia de tokens más plausible. Si algo es plausible pero falso (o no
// existe), el modelo puede generarlo con la misma confianza que algo cierto.
//
// Este script NO llama a ningún modelo (para no requerir red ni claves). En su
// lugar, demuestra el mecanismo con un "generador" de juguete que replica la
// propiedad relevante: produce el patrón de API más probable sin verificar que
// la API exista. El error no está en el generador; está en creerlo sin comprobar.
//
// Uso: node alucinacion-api-inexistente.js

/** Devuelve la forma más "plausible" de llamar a una API de X según el patrón. */
function apiInventada(nombre) {
  // Patrón estadísticamente común en librerías: get<Recurso>Async(...).
  return `await ${nombre}Client.get${capitalizar(nombre)}Async(id, { timeout: 1000 })`;
}

function capitalizar(p) {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

const recurso = "usuario";
const sugerencia = apiInventada(recurso);

console.log("Sugerencia del 'modelo':");
console.log("  " + sugerencia);
console.log("\nSuena plausible: nombre coherente, opciones razonables, estilo común.");
console.log("Pero ese método NO existe en ninguna librería real: está inventado.");
console.log("\n--- cómo se detecta antes de confiar ---");
console.log("1. Buscar el símbolo en la documentación oficial de la librería.");
console.log("2. Ejecutar un ejemplo mínimo y ver si lanza TypeError/ReferenceError.");
console.log("3. Comprobar el nombre en el package publicado (no en el resumen del modelo).");
console.log("\nRegla: si no lo has ejecutado ni lo has visto en la doc, no está verificado.");
