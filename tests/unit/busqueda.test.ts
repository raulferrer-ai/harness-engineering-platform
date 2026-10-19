import { describe, expect, it } from "vitest";
import {
  estadoDeBusqueda,
  mapearResultado,
  sanearExtracto,
  type DatoPagefind,
} from "../../src/lib/busqueda";

/**
 * Utilidades puras de la búsqueda con Pagefind (H4,
 * IMPLEMENTATION_PLAN.md §5.1): estados de la interfaz y seguridad de los
 * extractos que se inyectan con innerHTML.
 */

describe("estados de la interfaz de búsqueda", () => {
  it("consulta vacía o de un solo carácter se queda ocioso", () => {
    expect(estadoDeBusqueda("", 0)).toBe("ocioso");
    expect(estadoDeBusqueda("   ", 0)).toBe("ocioso");
    expect(estadoDeBusqueda("a", 0)).toBe("ocioso");
  });

  it("con resultados y al menos dos caracteres muestra resultados", () => {
    expect(estadoDeBusqueda("git", 3)).toBe("resultados");
    expect(estadoDeBusqueda("  git  ", 1)).toBe("resultados");
  });

  it("consulta válida sin coincidencias indica sin-resultados", () => {
    expect(estadoDeBusqueda("git", 0)).toBe("sin-resultados");
  });

  it("el error tiene prioridad sobre cualquier otro estado", () => {
    expect(estadoDeBusqueda("", 0, true)).toBe("error");
    expect(estadoDeBusqueda("git", 5, true)).toBe("error");
  });
});

describe("extractos de Pagefind", () => {
  it("conserva las marcas de coincidencia", () => {
    const texto = "antes de <mark>git</mark> después";
    expect(sanearExtracto(texto)).toBe(texto);
  });

  it("escapa cualquier otra etiqueta para que innerHTML no inyecte marcado", () => {
    expect(sanearExtracto("<script>alert(1)</script>")).toBe("&lt;script>alert(1)&lt;/script>");
    expect(sanearExtracto("<img src=x onerror=y>")).toBe("&lt;img src=x onerror=y>");
    expect(sanearExtracto("<mark onclick=x>git</mark>")).toBe("&lt;mark onclick=x>git</mark>");
    expect(sanearExtracto("</mark ><mark class=x>")).toBe("&lt;/mark >&lt;mark class=x>");
  });

  it("el texto plano se queda igual", () => {
    expect(sanearExtracto("texto & sencillo < 5")).toBe("texto & sencillo &lt; 5");
  });
});

describe("vista de un resultado", () => {
  const dato: DatoPagefind = {
    url: "/curriculo/n0/m1/l07-primeros-pasos-con-git/",
    meta: { title: "Primeros pasos con Git" },
    excerpt: "crea un historial con <mark>git init</mark>",
  };

  it("mapea título, enlace y extracto saneado", () => {
    expect(mapearResultado(dato)).toEqual({
      titulo: "Primeros pasos con Git",
      url: "/curriculo/n0/m1/l07-primeros-pasos-con-git/",
      extracto: "crea un historial con <mark>git init</mark>",
    });
  });

  it("sin título usa la URL; sin extracto queda vacío", () => {
    const sinTitulo: DatoPagefind = { ...dato, meta: {}, excerpt: undefined };
    const vista = mapearResultado(sinTitulo);
    expect(vista.titulo).toBe(dato.url);
    expect(vista.extracto).toBe("");
  });

  it("el título con solo espacios se considera ausente", () => {
    const tituloEspacios: DatoPagefind = { ...dato, meta: { title: "   " } };
    expect(mapearResultado(tituloEspacios).titulo).toBe(dato.url);
  });
});
