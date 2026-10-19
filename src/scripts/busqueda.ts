/**
 * Interfaz de búsqueda en `/buscar/` (hito H4). Carga Pagefind bajo demanda
 * desde `/pagefind/pagefind.js` (índice estático generado en cada build);
 * sin servidor, sin base de datos y sin estado que dependa del servidor.
 *
 * Estados cubiertos: ocioso (consulta vacía o muy corta), cargando (import +
 * búsqueda), resultados, sin resultados y error (índice ausente, p. ej. en
 * `astro dev` sin compilar).
 */
import {
  estadoDeBusqueda,
  mapearResultado,
  type EstadoBusqueda,
  type ResultadoBuscado,
} from "../lib/busqueda";

const RUTA_INDICE = "/pagefind/pagefind.js";
const MAX_RESULTADOS = 20;
const RETARDO_MS = 250;

interface ResultadoCrudo {
  data(): Promise<{
    url: string;
    meta: Record<string, string | undefined>;
    excerpt?: string;
  }>;
}

interface IndicePagefind {
  options(opciones: Record<string, unknown>): void;
  search(consulta: string): Promise<{ results: ResultadoCrudo[] }>;
}

const campo = document.querySelector<HTMLInputElement>("[data-consulta]");
const region = document.querySelector<HTMLElement>("[data-estado]");
const lista = document.querySelector<HTMLElement>("[data-resultados]");

if (campo && region && lista) {
  let indice: IndicePagefind | null = null;
  let falloIndice = false;
  let temporizador: ReturnType<typeof setTimeout> | null = null;

  const textoDeEstado = (estado: EstadoBusqueda, consulta: string, total: number): string => {
    switch (estado) {
      case "cargando":
        return "Buscando…";
      case "resultados":
        return `${total} ${total === 1 ? "resultado" : "resultados"} para «${consulta}»`;
      case "sin-resultados":
        return `Sin resultados para «${consulta}». Prueba con otra palabra o consulta el mapa del currículo.`;
      case "error":
        return "La búsqueda no está disponible: no se pudo cargar el índice. El índice se genera al compilar (npm run build); en desarrollo local, compila y usa npm run preview.";
      case "ocioso":
      default:
        return consulta.trim().length === 0
          ? "Escribe para buscar en las lecciones y módulos publicados."
          : "Escribe al menos 2 caracteres.";
    }
  };

  const pintar = (
    estado: EstadoBusqueda,
    consulta: string,
    resultados: readonly ResultadoBuscado[],
  ): void => {
    region.textContent = textoDeEstado(estado, consulta, resultados.length);
    lista.replaceChildren();
    if (estado !== "resultados") return;
    for (const resultado of resultados) {
      const item = document.createElement("li");
      item.className = "rounded-lg border border-line bg-surface p-4";
      const enlace = document.createElement("a");
      enlace.href = resultado.url;
      enlace.className = "font-medium text-accent hover:underline";
      enlace.textContent = resultado.titulo;
      item.append(enlace);
      if (resultado.extracto.length > 0) {
        const extracto = document.createElement("p");
        extracto.className = "mt-1 text-sm text-ink-soft";
        // extracto: HTML saneado por la lib (solo <mark>), probado en Vitest.
        extracto.innerHTML = resultado.extracto;
        item.append(extracto);
      }
      lista.append(item);
    }
  };

  const cargarIndice = async (): Promise<IndicePagefind> => {
    if (indice) return indice;
    if (falloIndice) throw new Error("Índice de búsqueda no disponible");
    try {
      // Ruta absoluta + @vite-ignore: el índice no existe durante `astro build`
      // (se genera después, con Pagefind), así que se resuelve en el navegador.
      const ruta = RUTA_INDICE;
      const modulo = (await import(/* @vite-ignore */ ruta)) as unknown as IndicePagefind;
      modulo.options({ baseUrl: "/" });
      indice = modulo;
      return indice;
    } catch (error) {
      falloIndice = true;
      throw error;
    }
  };

  const buscar = async (consulta: string): Promise<void> => {
    try {
      const indiceCargado = await cargarIndice();
      const respuesta = await indiceCargado.search(consulta.trim());
      const datos = await Promise.all(
        respuesta.results.slice(0, MAX_RESULTADOS).map((resultado) => resultado.data()),
      );
      if (campo.value.trim() !== consulta.trim()) return; // resultado obsoleto
      pintar(estadoDeBusqueda(consulta, datos.length), consulta, datos.map(mapearResultado));
    } catch {
      if (campo.value.trim() !== consulta.trim()) return;
      pintar("error", consulta, []);
    }
  };

  campo.addEventListener("input", () => {
    const consulta = campo.value;
    if (temporizador !== null) clearTimeout(temporizador);
    // El número de resultados no importa para decidir «ocioso» (0: marcador).
    const estado = estadoDeBusqueda(consulta, 0);
    if (estado === "ocioso") {
      pintar(estado, consulta, []);
      return;
    }
    // Estado «cargando» inmediato: cubre el retardo, la importación del
    // índice y la propia búsqueda.
    pintar("cargando", consulta, []);
    temporizador = setTimeout(() => void buscar(consulta), RETARDO_MS);
  });

  // «Enter» no navega: el formulario no tiene destino, fuerza la búsqueda.
  campo.form?.addEventListener("submit", (event) => {
    event.preventDefault();
    campo.dispatchEvent(new Event("input"));
  });

  // Estado inicial: el navegador puede repoblar `type="search"` al volver a la
  // página; en ese caso se lanza la búsqueda en lugar de pintar un falso
  // «resultados».
  const inicial = campo.value;
  if (estadoDeBusqueda(inicial, 0) === "ocioso") {
    pintar("ocioso", inicial, []);
  } else {
    pintar("cargando", inicial, []);
    void buscar(inicial);
  }
}
