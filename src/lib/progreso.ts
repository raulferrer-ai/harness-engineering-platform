/**
 * Progreso local de lecciones (IMPLEMENTATION_PLAN.md §5.3, hito H4).
 *
 * Reglas del alcance:
 * - Solo `localStorage` en el navegador: sin cuentas, sin analítica, sin
 *   backend y sin datos personales (solo identificadores `nN/mK/lNN-slug` y
 *   el valor `true`).
 * - El almacenamiento puede no existir o fallar (modo privado, cuota,
 *   políticas): toda operación declara su estado en lugar de lanzar.
 * - El HTML estático nunca afirma progreso: este módulo lo pinta en el
 *   navegador. La lógica es pura y está probada en `tests/unit/progreso.test.ts`.
 */

/** Clave versionada del almacén local. */
export const CLAVE_PROGRESO = "hep.progreso.v1";

/** Mensaje mostrado cuando no hay almacén utilizable. */
export const TEXTO_NO_DISPONIBLE = "No disponible en este navegador";

/** Interfaz mínima compatible con `Storage` (permite fakes en las pruebas). */
export interface Almacenamiento {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
}

export type EstadoAlmacen = "disponible" | "no-disponible";

export interface LecturaProgreso {
  estado: EstadoAlmacen;
  /** Unidades marcadas como completadas en este navegador. */
  completadas: ReadonlySet<string>;
}

/**
 * Lee el progreso almacenado. Nunca lanza: cualquier fallo de acceso o de
 * formato se traduce en un estado explícito (`no-disponible` o vacío).
 */
export function leerProgreso(almacen: Almacenamiento | null | undefined): LecturaProgreso {
  if (!almacen) return { estado: "no-disponible", completadas: new Set() };
  let crudo: string | null;
  try {
    crudo = almacen.getItem(CLAVE_PROGRESO);
  } catch {
    return { estado: "no-disponible", completadas: new Set() };
  }
  if (crudo === null || crudo === "") {
    return { estado: "disponible", completadas: new Set() };
  }
  try {
    const datos: unknown = JSON.parse(crudo);
    if (typeof datos !== "object" || datos === null || Array.isArray(datos)) {
      return { estado: "disponible", completadas: new Set() };
    }
    const completadas = new Set<string>();
    for (const [id, valor] of Object.entries(datos)) {
      if (valor === true) completadas.add(id);
    }
    return { estado: "disponible", completadas };
  } catch {
    // JSON corrupto: se trata como vacío; la próxima escritura lo reemplaza.
    return { estado: "disponible", completadas: new Set() };
  }
}

export interface EscrituraProgreso {
  /** true solo si el cambio se persistió en el almacén. */
  exito: boolean;
  completadas: ReadonlySet<string>;
}

/**
 * Marca/desmarca una lección y persiste el resultado. Si la escritura falla
 * se devuelve `exito: false` con el conjunto anterior: nada se aplica de
 * forma optimista, para que la interfaz no muestre un progreso no guardado.
 */
export function alternarLeccion(
  lectura: LecturaProgreso,
  almacen: Almacenamiento | null | undefined,
  id: string,
): EscrituraProgreso {
  if (lectura.estado === "no-disponible" || !almacen) {
    return { exito: false, completadas: lectura.completadas };
  }
  const nuevas = new Set(lectura.completadas);
  if (nuevas.has(id)) {
    nuevas.delete(id);
  } else {
    nuevas.add(id);
  }
  const objeto: Record<string, true> = {};
  for (const unidad of nuevas) objeto[unidad] = true;
  try {
    almacen.setItem(CLAVE_PROGRESO, JSON.stringify(objeto));
    return { exito: true, completadas: nuevas };
  } catch {
    return { exito: false, completadas: lectura.completadas };
  }
}

export interface ResumenModulo {
  completadas: number;
  total: number;
  porcentaje: number;
  /** Solo true si TODAS las unidades indicadas están marcadas (nunca con total 0). */
  completo: boolean;
}

/**
 * Resumen del módulo: cuenta únicamente las unidades indicadas (las marcas
 * marcadas fuera del módulo no cuentan) y jamás da «completo» con 0 unidades.
 */
export function resumenModulo(
  completadas: ReadonlySet<string>,
  idsUnidades: readonly string[],
): ResumenModulo {
  const total = idsUnidades.length;
  const hechas = idsUnidades.filter((id) => completadas.has(id)).length;
  const porcentaje = total === 0 ? 0 : Math.round((hechas / total) * 100);
  return { completadas: hechas, total, porcentaje, completo: total > 0 && hechas === total };
}

/** Texto del resumen mostrado en la interfaz. */
export function formatearResumen(resumen: ResumenModulo): string {
  if (resumen.completo) return `${resumen.total} de ${resumen.total} · Completado`;
  return `${resumen.completadas} de ${resumen.total} lecciones · ${resumen.porcentaje} %`;
}
