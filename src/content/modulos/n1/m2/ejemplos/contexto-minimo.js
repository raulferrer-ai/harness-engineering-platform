// contexto-minimo.js — incluir solo las piezas de contexto que la tarea necesita (l02)
//
// El contexto de una tarea son piezas que el asistente NO puede adivinar:
// fragmento del código relevante, convención del proyecto aplicable y comando
// de verificación. Todo lo demás (historia, archivos enteros, opiniones) es
// ruido que diluye la instrucción — m1/l04 ya mostró que la respuesta es
// sensible al contexto.
// Métrica honesta: contamos PALABRAS (las cuenta cualquier persona con wc -w),
// no "tokens" de un proveedor que no podemos medir aquí.
//
// Uso: node contexto-minimo.js

/** Palabras de `texto` (separadas por espacios; métrica grosera pero honesta). */
export function contarPalabras(texto) {
  const limpio = texto.trim();
  return limpio.length === 0 ? 0 : limpio.split(/\s+/).length;
}

/**
 * Selecciona las piezas marcadas como necesarias para la tarea.
 * @param {{ pieza: string, necesaria: boolean }} piezas
 */
export function seleccionar(piezas) {
  return piezas.filter((p) => p.necesaria);
}

const piezas = [
  {
    pieza:
      "fragmento del archivo existente: export function normalizarNombre(texto) { return texto.trim(); }",
    necesaria: true,
  },
  {
    pieza: "convención del proyecto: módulos ESM, funciones puras, nombres en español",
    necesaria: true,
  },
  {
    pieza: "comando de verificación: node --test normalizar-nombre.test.js",
    necesaria: true,
  },
  {
    pieza:
      "historia: el módulo nació en 2024 para el equipo de ventas y luego pasó a operaciones",
    necesaria: false,
  },
  {
    pieza:
      "el archivo completo de 300 líneas del que se extrajo el fragmento (export, helpers y tests incluidos)",
    necesaria: false,
  },
];

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("contexto-minimo.js")) {
  const seleccion = seleccionar(piezas);
  const palabrasSeleccion = contarPalabras(seleccion.map((p) => p.pieza).join(" "));
  const palabrasTotal = contarPalabras(piezas.map((p) => p.pieza).join(" "));

  console.log(`piezas candidatas: ${piezas.length}`);
  for (const p of piezas) {
    console.log(` ${p.necesaria ? "✓" : "✗"} ${p.necesaria ? "necesaria" : "ruido  "} — ${p.pieza.slice(0, 64)}…`);
  }
  console.log(`piezas seleccionadas: ${seleccion.length} de ${piezas.length}`);
  console.log(`palabras del contexto: ${palabrasSeleccion} (con el ruido serían ${palabrasTotal})`);
  console.log("contexto mínimo: solo piezas necesarias para esta tarea");
}
