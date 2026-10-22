// H15 — los datos declarados de las tres entregas del ejercicio.
// Cada entrega es lo que el asistente devuelve: un diff (antes → después),
// la suite que la acompaña y una descripción en prosa. Los casos límite son
// los que la tarea original exigía cumplir (prerrequisito: n1/m2/l03).

export const entregas = [
  {
    id: "gastos",
    titulo: "Total de gastos con redondeo a dos decimales",
    descripcion:
      "Arreglado el total para que devuelva un número (antes devolvía texto). Añadidas 4 pruebas; las 4 pasan.",
    dependenciasAntes: [],
    dependenciasDespues: [],
    funcion: "total",
    casosLimite: [
      { llamada: [[]], esperado: 0 },
      { llamada: [[{ importe: 1.25 }, { importe: 2.3 }]], esperado: 3.55 },
      { llamada: [[{ importe: -5 }, { importe: 12.5 }]], esperado: 7.5 },
    ],
  },
  {
    id: "informes",
    titulo: "Resumen de importes con top y media",
    descripcion:
      "Corregido el cálculo del top y redondeada la media. Añadidas 4 pruebas; las 4 pasan.",
    dependenciasAntes: [],
    dependenciasDespues: [],
    funcion: "resumen",
    casosLimite: [
      { llamada: [[10, 20, 30]], esperado: { top: 30, media: 20 } },
      { llamada: [[]], esperado: { top: null, media: 0 } },
      { llamada: [[5]], esperado: { top: 5, media: 5 } },
    ],
  },
  {
    id: "fechas",
    titulo: "Detección de años bisiestos con la regla completa",
    descripcion:
      "Arreglado esBisiesto con la regla completa (siglos y el 400). Añadido dayjs para manejar fechas. Añadidas 4 pruebas; las 4 pasan.",
    dependenciasAntes: [],
    dependenciasDespues: ["dayjs"],
    funcion: "esBisiesto",
    casosLimite: [
      { llamada: [2024], esperado: true },
      { llamada: [1900], esperado: false },
      { llamada: [2000], esperado: true },
      { llamada: [2023], esperado: false },
    ],
  },
];
