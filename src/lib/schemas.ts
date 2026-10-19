/**
 * Esquemas de las colecciones de contenido (H2).
 *
 * Fuente de verdad de los campos: CURRICULUM.md §2 (niveles), §3 (módulos),
 * §6–§7 (lecciones), §9 (glosario y referencias) y §4 (proyecto), con los
 * desajustes resueltos y registrados en IMPLEMENTATION_PLAN.md §10.2 (D1–D21).
 *
 * Se importa `z` de `astro/zod` (el mismo módulo que reexporta `astro:content`)
 * para que los esquemas sean validables también en Vitest, sin aliases.
 */
import { z } from "astro/zod";

/** Identificadores de nivel, exactamente los de CURRICULUM.md §2. */
export const NIVELES = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"] as const;
export const DIFICULTADES = ["inicial", "intermedio", "avanzado", "experto"] as const;
export const TIPOS_LECCION = ["leccion", "laboratorio", "ejercicio"] as const;
export const TIPOS_REFERENCIA = ["documentacion", "estandar", "articulo"] as const;
export const FASES_PROYECTO = ["f1", "f2", "f3", "f4", "f5", "f6", "f7"] as const;

/** Fecha corta ISO `YYYY-MM-DD` (fecha de creación o de consulta real de la ficha). */
const fechaCorta = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha ISO corta con formato YYYY-MM-DD");

const titulo = z.string().trim().min(1, "El título no puede estar vacío");

const nivelId = z.enum(NIVELES);

/** `m1`, `m2`, … (no `m0`: los módulos empiezan en 1, CURRICULUM.md §3). */
const moduloId = z
  .string()
  .regex(/^m[1-9]\d*$/, "Identificador de módulo con formato mK (m1, m2, …)");

/** Verbos observables, sin relleno. */
const objetivosCon = (min: number, max: number) =>
  z
    .array(z.string().trim().min(5, "Objetivo demasiado corto: usa verbos observables"))
    .min(min)
    .max(max);

/** Identidad de una unidad: `nN` (nivel), `nN/mK` (módulo) o `nN/mK/lNN-slug` (lección). */
const idUnidad = z.string().trim().min(1);

const etiquetas = z.array(z.string().trim().min(1)).default([]);

/**
 * Nivel (CURRICULUM.md §2 y §5): misión, prerrequisitos, criterio.
 * La lista de módulos no es frontmatter: se deriva de la colección `modulos`
 * (una sola fuente de verdad). El orden se deriva del identificador `nN`.
 */
export const schemaNivel = z.object({
  titulo,
  /** Pregunta que resuelve el nivel (CURRICULUM.md §2). */
  pregunta: z.string().trim().min(10),
  /** Una frase fiel a la misión del nivel; no aporta datos nuevos. */
  mision: z.string().trim().min(10),
  /** Niveles previos (vacío en `n0`, "Ninguno" en CURRICULUM.md §2). */
  prerrequisitos: z.array(nivelId).default([]),
  /** Criterio de aprobación del nivel. */
  criterio: z.string().trim().min(10),
  actualizado: fechaCorta,
});

/**
 * Módulo (CURRICULUM.md §3 y §5).
 * Decisiones registradas (IMPLEMENTATION_PLAN.md §10.2):
 * - sin `resumen`: la página usa `objetivos[0]` (evita duplicar el objetivo).
 * - sin `orden`: se deriva del identificador `mK` (sin dos fuentes de verdad).
 * - sin `dificultad`/`tiempoEstimado`/`tipo`: el currículo no los define por módulo.
 * - `prerrequisitos` opcional: CURRICULUM.md no declara dependencias por módulo.
 */
export const schemaModulo = z.object({
  titulo,
  nivel: nivelId,
  modulo: moduloId,
  /** Objetivo de aprendizaje de CURRICULUM.md §3 cargado como lista (1 mínimo). */
  objetivos: objetivosCon(1, 6),
  /** Prueba de que el módulo está asimilado (CURRICULUM.md §3, columna «Entregable»). */
  entregable: z.string().trim().min(3),
  prerrequisitos: z.array(idUnidad).default([]),
  tags: etiquetas,
  actualizado: fechaCorta,
});

/**
 * Lección o laboratorio (CURRICULUM.md §5–§7).
 * `orden` es frontmatter (regla de §7 y base de «anterior/siguiente» del plan §5.2);
 * el prefijo del fichero `lNN` debe coincidir, y lo comprueba tests/content/.
 */
export const schemaLeccion = z.object({
  titulo,
  /** 1–2 frases (CURRICULUM.md §6, punto 1) usadas además como meta descripción. */
  resumen: z.string().trim().min(10),
  nivel: nivelId,
  modulo: moduloId,
  orden: z.number().int().positive(),
  dificultad: z.enum(DIFICULTADES),
  /** Minutos. */
  tiempoEstimado: z.number().int().positive(),
  /** 3–6 objetivos observables (CURRICULUM.md §6, punto 2). */
  objetivos: objetivosCon(3, 6),
  prerrequisitos: z.array(idUnidad).default([]),
  tags: etiquetas,
  actualizado: fechaCorta,
  /** Toda fuente citada lleva fecha de consulta (CURRICULUM.md §9). */
  fuentes: z
    .array(
      z.object({
        titulo: z.string().trim().min(1),
        url: z.url(),
        fecha: fechaCorta,
      }),
    )
    .optional(),
  tipo: z.enum(TIPOS_LECCION).default("leccion"),
});

/** Glosario (CURRICULUM.md §9): término, definición corta, enlace, fecha de revisión. */
export const schemaGlosario = z.object({
  /** Término. */
  titulo,
  definicion: z.string().trim().min(10),
  /** Unidad donde se explica por primera vez (`nN/mK/lNN-slug`), si ya existe. */
  leccion: idUnidad.optional(),
  actualizado: fechaCorta,
});

/** Referencia (CURRICULUM.md §9): fuente con fecha de consulta obligatoria. */
export const schemaReferencia = z.object({
  titulo,
  url: z.url(),
  /** Qué aporta esta fuente al currículo. */
  queAporta: z.string().trim().min(10),
  tipo: z.enum(TIPOS_REFERENCIA),
  /** Fecha de consulta real de la fuente. */
  fechaConsulta: fechaCorta,
});

/** Fase del proyecto longitudinal (CURRICULUM.md §4). */
export const schemaFase = z.object({
  /** `f1`…`f7`. */
  fase: z.string().regex(/^f[1-7]$/, "Identificador de fase con formato fK (f1…f7)"),
  titulo,
  /** Niveles asociados a la fase (CURRICULUM.md §4, columna «Nivel asociado»). */
  niveles: z.array(nivelId).min(1),
  /** Qué se construye en la fase. */
  queConstruye: z.string().trim().min(10),
  /** Criterio de verificación de la fase. */
  criterioVerificacion: z.string().trim().min(10),
  /** `f7` es opcional en CURRICULUM.md §4. */
  opcional: z.boolean().default(false),
  actualizado: fechaCorta,
});
