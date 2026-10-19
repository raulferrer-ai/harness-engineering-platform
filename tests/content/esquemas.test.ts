import { describe, expect, it } from "vitest";
import {
  schemaFase,
  schemaGlosario,
  schemaLeccion,
  schemaModulo,
  schemaNivel,
  schemaReferencia,
} from "../../src/lib/schemas";

/**
 * H2: los esquemas rechazan metadatos inválidos (IMPLEMENTATION_PLAN.md §7,
 * lista de tests). Cada fixture válido representa el formato mínimo real que
 * admite la colección, incluidos los campos con valor por defecto.
 */

const nivelValido = {
  titulo: "Fundamentos de programación y desarrollo de software",
  pregunta: "¿Cómo se escribe, ejecuta y comprueba un programa?",
  mision: "Aprender a escribir, ejecutar y comprobar un programa por ti mismo.",
  prerrequisitos: [] as string[],
  criterio: "Se aprueba cuando entregas el entregable verificable de sus módulos.",
  actualizado: "2026-10-19",
};

const moduloValido = {
  titulo: "Entorno, ejecución y verificación",
  nivel: "n0",
  modulo: "m1",
  objetivos: ["Instalar un entorno, ejecutar un programa y comprobar su salida."],
  entregable: "Programa pequeño con pruebas automatizadas y primer commit",
  actualizado: "2026-10-19",
};

const leccionValida = {
  titulo: "Qué es programar y cómo se ejecuta un programa",
  resumen: "Programar es escribir instrucciones que una máquina ejecuta paso a paso.",
  nivel: "n0",
  modulo: "m1",
  orden: 1,
  dificultad: "inicial",
  tiempoEstimado: 30,
  objetivos: [
    "Explicar el ciclo escribir, ejecutar y comprobar y por qué se repite",
    "Identificar las piezas de un script corto antes de ejecutarlo",
    "Predecir la salida de un programa de diez líneas",
  ],
  actualizado: "2026-10-19",
};

const glosarioValido = {
  titulo: "Harness",
  definicion:
    "Capa de código y configuración que controla cómo un modelo ejecuta tareas: permisos, presupuestos, validación y registro.",
  actualizado: "2026-10-19",
};

const referenciaValida = {
  titulo: "Command-line API | Node.js Documentation",
  url: "https://nodejs.org/docs/latest-v24.x/api/cli.html",
  queAporta: "Sintaxis de ejecución y resolución del fichero de entrada.",
  tipo: "documentacion",
  fechaConsulta: "2026-10-19",
};

const faseValida = {
  fase: "f1",
  titulo: "Aplicación sencilla",
  niveles: ["n0"],
  queConstruye: "Una aplicación pequeña con pruebas desde el primer módulo.",
  criterioVerificacion: "Las pruebas pasan en verde y el historial de Git es limpio.",
  actualizado: "2026-10-19",
};

function exigeOk(
  resultado: { success: boolean; data?: unknown },
  mensaje: string,
): Record<string, any> {
  if (!resultado.success) throw new Error(mensaje);
  return resultado.data as Record<string, any>;
}

function exigeFallo(resultado: { success: boolean }, mensaje: string): void {
  if (resultado.success) throw new Error(mensaje);
}

describe("esquema de niveles", () => {
  it("acepta una ficha válida y normaliza los prerrequisitos a lista vacía", () => {
    const { prerrequisitos, ...sinLista } = nivelValido;
    const datos = exigeOk(schemaNivel.safeParse(sinLista), "nivel válido rechazado");
    expect(datos.prerrequisitos).toEqual([]);
  });

  it("rechaza un prerrequisito que no es un nivel del currículo", () => {
    exigeFallo(
      schemaNivel.safeParse({ ...nivelValido, prerrequisitos: ["n9"] }),
      "aceptó el prerrequisito inexistente n9",
    );
  });

  it("rechaza título vacío y fecha con formato distinto a YYYY-MM-DD", () => {
    exigeFallo(schemaNivel.safeParse({ ...nivelValido, titulo: "  " }), "aceptó título vacío");
    exigeFallo(
      schemaNivel.safeParse({ ...nivelValido, actualizado: "19-10-2026" }),
      "aceptó fecha mal formada",
    );
  });
});

describe("esquema de módulos", () => {
  it("acepta una ficha válida con prerrequisitos y tags por defecto", () => {
    const datos = exigeOk(schemaModulo.safeParse(moduloValido), "módulo válido rechazado");
    expect(datos.prerrequisitos).toEqual([]);
    expect(datos.tags).toEqual([]);
  });

  it("rechaza un módulo sin entregable ni objetivos", () => {
    const { entregable, ...sinEntregable } = moduloValido;
    exigeFallo(schemaModulo.safeParse(sinEntregable), "aceptó un módulo sin entregable");
    exigeFallo(
      schemaModulo.safeParse({ ...moduloValido, objetivos: [] }),
      "aceptó un módulo sin objetivos",
    );
  });

  it("rechaza identificadores de nivel o de módulo fuera de formato", () => {
    exigeFallo(
      schemaModulo.safeParse({ ...moduloValido, nivel: "nivel-0" }),
      "aceptó un nivel inexistente",
    );
    exigeFallo(
      schemaModulo.safeParse({ ...moduloValido, modulo: "m0" }),
      "aceptó m0 (los módulos empiezan en m1)",
    );
  });
});

describe("esquema de lecciones", () => {
  it("acepta una ficha válida con tipo y fuentes por defecto/opcionales", () => {
    const datos = exigeOk(schemaLeccion.safeParse(leccionValida), "lección válida rechazada");
    expect(datos.tipo).toBe("leccion");
    expect(datos.fuentes).toBeUndefined();
  });

  it("rechaza menos de tres objetivos u objetivos sin verbo observable", () => {
    exigeFallo(
      schemaLeccion.safeParse({ ...leccionValida, objetivos: leccionValida.objetivos.slice(0, 2) }),
      "aceptó solo dos objetivos (el currículo exige 3–6)",
    );
    exigeFallo(
      schemaLeccion.safeParse({
        ...leccionValida,
        objetivos: ["ok", ...leccionValida.objetivos.slice(1)],
      }),
      "aceptó un objetivo demasiado corto",
    );
  });

  it("rechaza orden no entero o no positivo, y dificultad o tipo desconocidos", () => {
    exigeFallo(schemaLeccion.safeParse({ ...leccionValida, orden: 0 }), "aceptó orden 0");
    exigeFallo(
      schemaLeccion.safeParse({ ...leccionValida, orden: 1.5 }),
      "aceptó orden con decimales",
    );
    exigeFallo(
      schemaLeccion.safeParse({ ...leccionValida, dificultad: "facil" }),
      "aceptó una dificultad fuera del currículo",
    );
    exigeFallo(
      schemaLeccion.safeParse({ ...leccionValida, tipo: "tarea" }),
      "aceptó un tipo de lección desconocido",
    );
  });

  it("rechaza resumen o tiempo estimado inválidos", () => {
    exigeFallo(
      schemaLeccion.safeParse({ ...leccionValida, resumen: "corto" }),
      "aceptó un resumen demasiado corto",
    );
    exigeFallo(
      schemaLeccion.safeParse({ ...leccionValida, tiempoEstimado: -5 }),
      "aceptó un tiempo negativo",
    );
  });

  it("rechaza una fuente con URL o fecha de consulta inválidas", () => {
    exigeFallo(
      schemaLeccion.safeParse({
        ...leccionValida,
        fuentes: [{ titulo: "Doc", url: "no-es-una-url", fecha: "2026-10-19" }],
      }),
      "aceptó una URL inválida",
    );
    exigeFallo(
      schemaLeccion.safeParse({
        ...leccionValida,
        fuentes: [{ titulo: "Doc", url: "https://example.com", fecha: "hoy" }],
      }),
      "aceptó una fecha de consulta inválida",
    );
  });
});

describe("esquemas de glosario, referencias y proyecto", () => {
  it("glosario: acepta una entrada válida y rechaza definiciones demasiado cortas", () => {
    expect(schemaGlosario.safeParse(glosarioValido).success).toBe(true);
    exigeFallo(
      schemaGlosario.safeParse({ ...glosarioValido, definicion: "corto" }),
      "aceptó una definición de una palabra",
    );
  });

  it("referencias: exige URL, tipo y fecha de consulta correctos", () => {
    expect(schemaReferencia.safeParse(referenciaValida).success).toBe(true);
    exigeFallo(
      schemaReferencia.safeParse({ ...referenciaValida, tipo: "blog" }),
      "aceptó un tipo de referencia no previsto",
    );
    exigeFallo(
      schemaReferencia.safeParse({ ...referenciaValida, fechaConsulta: "2026/10/19" }),
      "aceptó una fecha de consulta mal formada",
    );
  });

  it("proyecto: acepta f1–f7, rechaza otra fase y exige al menos un nivel", () => {
    expect(schemaFase.safeParse(faseValida).success).toBe(true);
    exigeFallo(
      schemaFase.safeParse({ ...faseValida, fase: "f0" }),
      "aceptó una fase fuera de rango",
    );
    exigeFallo(
      schemaFase.safeParse({ ...faseValida, niveles: [] }),
      "aceptó una fase sin niveles asociados",
    );
    const conOpcional = exigeOk(
      schemaFase.safeParse({ ...faseValida, fase: "f7", opcional: true }),
      "f7 opcional rechazada",
    );
    expect(conOpcional.opcional).toBe(true);
  });
});
