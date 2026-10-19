/**
 * Lógica pura del currículo (sin acceso a colecciones: solo funciones y datos
 * del proyecto longitudinal que aún no tiene colección propia).
 *
 * - Los niveles y módulos ya NO viven aquí: se derivan de las colecciones
 *   `niveles` y `modulos` (src/content.config.ts), única fuente de verdad.
 * - La identidad de una unidad es la ruta bajo /curriculo/ (decisión D9,
 *   IMPLEMENTATION_PLAN.md §10.2): nivel `nN`, módulo `nN/mK`, lección
 *   `nN/mK/lNN-slug`.
 */

/** Construye la ruta de un nivel: `/curriculo/n0/`. */
export function rutaNivel(nivel: string): string {
  return `/curriculo/${nivel}/`;
}

/** Construye la ruta de un módulo: `/curriculo/n0/m1/`. */
export function rutaModulo(nivel: string, modulo: string): string {
  return `/curriculo/${nivel}/${modulo}/`;
}

/** Construye la ruta de una lección: `/curriculo/n0/m1/l01-…/`. */
export function rutaLeccion(nivel: string, modulo: string, slug: string): string {
  return `/curriculo/${nivel}/${modulo}/${slug}/`;
}

/**
 * Ruta de cualquier unidad por su identificador (D9): `n0` → nivel,
 * `n0/m1` → módulo, `n0/m1/l01-…` → lección.
 */
export function rutaDeUnidad(id: string): string {
  const partes = id.split("/");
  if (partes.some((parte) => parte === "")) {
    throw new Error(`Identificador de unidad no válido: ${id}`);
  }
  if (partes.length === 1) return rutaNivel(partes[0]);
  if (partes.length === 2) return rutaModulo(partes[0], partes[1]);
  if (partes.length === 3) return rutaLeccion(partes[0], partes[1], partes[2]);
  throw new Error(`Identificador de unidad no válido: ${id}`);
}

/** Identificador de módulo (`m1`, `m2`, …) a número de orden. */
export function ordenDeModulo(modulo: string): number {
  const n = Number(modulo.replace(/^m/, ""));
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

/** Identificador de nivel (`n0`…`n8`) a número de orden. */
export function ordenDeNivel(nivel: string): number {
  const n = Number(nivel.replace(/^n/, ""));
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

/** Ordena por el campo `orden` ascendente; entradas con el mismo `orden` se quedan como estén. */
export function ordenarPorOrden<T extends { orden: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.orden - b.orden);
}

/**
 * Navegación «anterior / siguiente» de las unidades de un mismo módulo,
 * calculada desde `orden` (IMPLEMENTATION_PLAN.md §5.2): la primera no tiene
 * anterior, la última no tiene siguiente, y cada par es simétrico.
 */
export function paresDeNavegacion<T extends { id: string; orden: number }>(
  unidades: readonly T[],
): Array<{ actual: T; anterior: T | null; siguiente: T | null }> {
  const ordenadas = ordenarPorOrden(unidades);
  return ordenadas.map((actual, i) => ({
    actual,
    anterior: i > 0 ? ordenadas[i - 1] : null,
    siguiente: i < ordenadas.length - 1 ? ordenadas[i + 1] : null,
  }));
}

export interface FaseProyecto {
  id: string;
  titulo: string;
  /** Qué se construye en esta fase. */
  descripcion: string;
  /** Niveles asociados a la fase. */
  niveles: string;
}

/**
 * Fases del proyecto longitudinal (CURRICULUM.md §4, f1–f6).
 * Temporal: se sustituirá por la colección `proyecto` cuando las fases se
 * publiquen como contenido (decisión registrada en IMPLEMENTATION_PLAN.md §10.2).
 */
export const fasesProyecto: readonly FaseProyecto[] = [
  {
    id: "f1",
    titulo: "Aplicación sencilla",
    descripcion: "Con pruebas y un historial de Git limpio.",
    niveles: "n0",
  },
  {
    id: "f2",
    titulo: "Evolución con asistente",
    descripcion: "Cada cambio acompañado de pruebas y revisión del diff.",
    niveles: "n1",
  },
  {
    id: "f3",
    titulo: "Especificaciones y CI",
    descripcion: "Requisito → especificación → pruebas → CI en verde.",
    niveles: "n2–n3",
  },
  {
    id: "f4",
    titulo: "Harness propio",
    descripcion: "Tareas acotadas con presupuesto, validación y registro.",
    niveles: "n4",
  },
  {
    id: "f5",
    titulo: "Agente supervisado",
    descripcion: "Con segundo agente revisor y aprobación humana en lo irreversible.",
    niveles: "n5–n6",
  },
  {
    id: "f6",
    titulo: "Evaluación y despliegue",
    descripcion: "Evaluación reproducible, seguridad y reversión probada.",
    niveles: "n7",
  },
] as const;
