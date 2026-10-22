// serie-rota.js — una serie con los fallos típicos de formulación (l06, rojo)
// Termina en rojo a propósito: comprobar-serie.js debe rechazarla con varias
// incidencias. Es la fase roja del entregable: rompes la serie a propósito y
// el validador te lo enseña; luego la corriges hasta dejarlo en verde.
// Uso: node comprobar-serie.js errores/serie-rota.js (devuelve código 1).

export const serie = [
  {
    id: "tarea-a",
    titulo: "Arreglar el login",
    instruccion: "Arregla el login.", // 16 caracteres: vaga
    entregable: "el login arreglado y además documentado en el README", // dos cosas: no es UN entregable
    criterios: [
      "funciona",
      "está bonito",
      "no rompe nada",
      "es rápido",
      "mantiene la convención",
      "queda documentado",
    ], // 6 criterios: el curso admite 5
    contexto: [
      "fragmento: src/login.js entero (800 líneas)",
      "historia: el login se escribió en 2023",
      "opinión: preferimos Express aunque no haga falta",
      "convención: ESM",
      "verificación: node --test login.test.js",
    ], // 5 piezas: el curso admite 3
    archivosPermitidos: ["src/login.js"],
    verificacion: "node --test login.test.js",
  },
  {
    id: "tarea-b",
    titulo: "Mejorar el rendimiento",
    instruccion:
      "Mejora el rendimiento general del módulo de informes aprovechando cualquier oportunidad que encuentres al revisar el código.",
    entregable: "", // sin entregable
    criterios: ["va más rápido"],
    contexto: ["el módulo va lento, pero nadie ha medido nada todavía"],
    archivosPermitidos: [], // sin frontera
    verificacion: "abre el navegador y comprueba a mano que va más rápido", // no es un comando ejecutable
  },
  {
    id: "tarea-c",
    titulo: "Añadir el informe CSV",
    instruccion:
      "Añade al informe de gastos una exportación CSV con cabecera y filas escapadas según la convención de comillas del proyecto.",
    entregable: "un único archivo src/csv.js que exporta generarCsv(filas)",
    criterios: [
      "cabecera con los cuatro nombres de columna",
      "las comillas de las celdas se duplican",
      "las filas terminan en \\n sin \\r\\n",
    ],
    contexto: [
      "fragmento: cabecera actual del informe en src/informe.js",
      "convención: comillas SQL-style (doble comilla duplicada)",
      "verificación: node --test csv.test.js",
    ],
    archivosPermitidos: ["src/csv.js"],
    verificacion: "node --test csv.test.js",
  },
];
