// comprobar-nota.js — valida la estructura de la nota técnica (l06, el entregable)
//
// El entregable de n1/m1 es «una nota técnica con fuentes citadas y fecha».
// Este script convierte la calidad del entregable en una condición ejecutable:
// comprueba que la nota tiene sus secciones, al menos tres afirmaciones
// numeradas y, para cada fuente, una URL y una fecha de consulta con formato
// ISO. No valida el contenido (eso lo discutes tú y tu revisor); valida que
// nada quede sin anclar.
//
// Uso: node comprobar-nota.js ruta/nota.md   → código 0 si es válida, 1 si no.

import { readFileSync } from "node:fs";

const SECCIONES = [
  "## Pregunta",
  "## Respuesta corta",
  "## Afirmaciones",
  "## Evidencia",
  "## Fuentes",
];

const MINIMO_AFIRMACIONES = 3;
const MINIMO_FUENTES = 2;

/** Devuelve los problemas de la nota (vacío = válida) y sus recuentos. */
export function comprobarNota(texto) {
  const problemas = [];

  for (const seccion of SECCIONES) {
    if (!texto.includes(seccion)) problemas.push(`falta la sección «${seccion}»`);
  }

  const afirmaciones = texto.match(/^\d+\.\s+\S/gm) ?? [];
  if (afirmaciones.length < MINIMO_AFIRMACIONES) {
    problemas.push(
      `hacen falta al menos ${MINIMO_AFIRMACIONES} afirmaciones numeradas (hay ${afirmaciones.length})`,
    );
  }

  const lineasFuente = texto.split("\n").filter((l) => l.startsWith("- ["));
  if (lineasFuente.length < MINIMO_FUENTES) {
    problemas.push(`hacen falta al menos ${MINIMO_FUENTES} fuentes (hay ${lineasFuente.length})`);
  }
  for (const linea of lineasFuente) {
    if (!/\]\(https?:\/\/[^)]+\)/.test(linea)) {
      problemas.push(`fuente sin URL: ${linea}`);
    }
    if (!/— consultado el \d{4}-\d{2}-\d{2}$/.test(linea)) {
      problemas.push(`fuente sin fecha de consulta (AAAA-MM-DD): ${linea}`);
    }
  }

  return { problemas, afirmaciones: afirmaciones.length, fuentes: lineasFuente.length };
}

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("comprobar-nota.js")) {
  const ruta = process.argv[2];
  if (!ruta) {
    console.error("Uso: node comprobar-nota.js ruta/nota.md");
    process.exit(1);
  }

  let texto;
  try {
    texto = readFileSync(ruta, "utf8");
  } catch (error) {
    console.error(`No se pudo leer ${ruta}: ${error.message}`);
    process.exit(1);
  }

  const { problemas, afirmaciones, fuentes } = comprobarNota(texto);
  if (problemas.length > 0) {
    console.error(`NOTA NO VÁLIDA — ${problemas.length} problema(s) en ${ruta}:`);
    for (const problema of problemas) console.error(`  - ${problema}`);
    process.exit(1);
  }

  console.log(`NOTA VÁLIDA — ${ruta}`);
  console.log(`  afirmaciones: ${afirmaciones}`);
  console.log(`  fuentes con URL y fecha de consulta: ${fuentes}`);
}
