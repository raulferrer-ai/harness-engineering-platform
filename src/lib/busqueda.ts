/**
 * Utilidades puras de la búsqueda con Pagefind (hito H4,
 * IMPLEMENTATION_PLAN.md §5.1). La parte que toca el DOM vive en
 * `src/scripts/busqueda.ts`; aquí solo lógica verificable con Vitest.
 */

/** Estados posibles de la interfaz de búsqueda. */
export type EstadoBusqueda = "ocioso" | "cargando" | "resultados" | "sin-resultados" | "error";

/**
 * Deriva el estado de la interfaz. Las consultas de menos de 2 caracteres no
 * disparan búsqueda (se quedan «ocioso»); el estado de error tiene prioridad.
 */
export function estadoDeBusqueda(
  consulta: string,
  numeroResultados: number,
  hayError = false,
): EstadoBusqueda {
  if (hayError) return "error";
  if (consulta.trim().length < 2) return "ocioso";
  return numeroResultados > 0 ? "resultados" : "sin-resultados";
}

/** Data cruda que Pagefind devuelve en `result.data()`. */
export interface DatoPagefind {
  url: string;
  meta: Record<string, string | undefined>;
  excerpt?: string;
}

/** Vista de un resultado para la interfaz. */
export interface ResultadoBuscado {
  titulo: string;
  url: string;
  /** Extracto HTML seguro: solo puede contener `<mark>`. */
  extracto: string;
}

/**
 * Los extractos de Pagefind envuelven las coincidencias en `<mark>`; todo
 * otro `<` se escapa para que el `innerHTML` del resultado no pueda inyectar
 * marcado arbitrario.
 */
export function sanearExtracto(excerpt: string): string {
  return excerpt.replace(/<(?!\/?mark>)/g, "&lt;");
}

/** Convierte el dato de Pagefind en la vista que dibuja la interfaz. */
export function mapearResultado(dato: DatoPagefind): ResultadoBuscado {
  const titulo = dato.meta.title?.trim();
  return {
    titulo: titulo && titulo.length > 0 ? titulo : dato.url,
    url: dato.url,
    extracto: sanearExtracto(dato.excerpt ?? ""),
  };
}
