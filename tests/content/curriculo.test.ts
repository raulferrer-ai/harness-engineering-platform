import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { paresDeNavegacion, rutaLeccion, rutaModulo, rutaNivel } from "../../src/lib/curriculum";
import { schemaLeccion, schemaModulo, schemaNivel } from "../../src/lib/schemas";

/**
 * H2: integridad del contenido real de `src/content/` leída directamente de los
 * ficheros (frontmatter con `yaml`), de forma independiente a que Astro compile.
 * Cubre IMPLEMENTATION_PLAN.md §7: esquemas, relaciones, identificadores,
 * rutas únicas y navegación anterior/siguiente.
 */

const dirContenido = fileURLToPath(new URL("../../src/content/", import.meta.url));

interface Fichero {
  /** Ruta relativa a `src/content/` con `/` como separador. */
  rel: string;
  data: Record<string, any>;
  cuerpo: string;
}

function listar(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(dir, entrada.name);
    return entrada.isDirectory() ? listar(ruta) : [ruta];
  });
}

function leerFichero(rutaAbs: string): Fichero {
  const texto = readFileSync(rutaAbs, "utf8");
  const partes = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!partes) throw new Error(`Fichero sin frontmatter: ${rutaAbs}`);
  return {
    rel: rutaAbs.slice(dirContenido.length),
    data: parse(partes[1]) as Record<string, any>,
    cuerpo: partes[2],
  };
}

const idsNivelEsperados = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"];

// --- Lectura de las colecciones reales (mismos patrones que content.config.ts) ---

const fichasNivel = readdirSync(join(dirContenido, "niveles"), { withFileTypes: true })
  .filter((e) => e.isFile() && !e.name.startsWith("."))
  .map((e) => leerFichero(join(dirContenido, "niveles", e.name)));

const fichasModulo = listar(join(dirContenido, "modulos"))
  .filter((ruta) => ruta.endsWith("/index.mdx"))
  .map(leerFichero);

const fichasLeccion = listar(join(dirContenido, "modulos"))
  .filter((ruta) => /[/\\]lecciones[/\\][^/\\]+\.mdx$/.test(ruta))
  .map(leerFichero);

const segmentos = (f: Fichero) => f.rel.split("/");
const idDeNivel = (f: Fichero) =>
  f.rel
    .split("/")
    .at(-1)!
    .replace(/\.(md|mdx)$/, "");
const idDeModulo = (f: Fichero) => {
  const s = segmentos(f);
  return `${s[1]}/${s[2]}`;
};
const slugDeLeccion = (f: Fichero) => {
  const s = segmentos(f);
  return s.at(-1)!.replace(/\.mdx$/, "");
};
const idDeLeccion = (f: Fichero) => {
  const s = segmentos(f);
  return `${s[1]}/${s[2]}/${slugDeLeccion(f)}`;
};

const idsNivel = new Set(fichasNivel.map(idDeNivel));
const idsModulo = fichasModulo.map(idDeModulo);
const idsLeccion = fichasLeccion.map(idDeLeccion);
const unidadesConocidas = new Set([...idsNivel, ...idsModulo, ...idsLeccion]);

describe("colección de niveles", () => {
  it("existe exactamente un fichero por nivel, de n0 a n8, sin duplicados", () => {
    const ids = fichasNivel.map(idDeNivel).sort();
    expect(ids).toEqual([...idsNivelEsperados]);
  });

  it("cada ficha de nivel supera su esquema", () => {
    for (const ficha of fichasNivel) {
      expect(schemaNivel.safeParse(ficha.data).success, ficha.rel).toBe(true);
    }
  });

  it("los prerrequisitos de cada nivel existen, no son él mismo y son niveles anteriores", () => {
    for (const ficha of fichasNivel) {
      const id = idDeNivel(ficha);
      const propios = (ficha.data.prerrequisitos ?? []) as string[];
      expect(propios, ficha.rel).not.toContain(id);
      for (const previo of propios) {
        expect(idsNivel.has(previo), `${ficha.rel}: prerrequisito inexistente «${previo}»`).toBe(
          true,
        );
        expect(
          Number(previo.slice(1)),
          `${ficha.rel}: «${previo}» no es anterior a «${id}»`,
        ).toBeLessThan(Number(id.slice(1)));
      }
    }
  });

  it("cada nivel tiene al menos un módulo (regla de CURRICULUM.md §7)", () => {
    for (const id of idsNivelEsperados) {
      const total = idsModulo.filter((m) => m.startsWith(`${id}/`)).length;
      expect(total, `el nivel ${id} no tiene módulos`).toBeGreaterThan(0);
    }
  });
});

describe("colección de módulos", () => {
  it("cada ficha de módulo supera su esquema", () => {
    for (const ficha of fichasModulo) {
      expect(schemaModulo.safeParse(ficha.data).success, ficha.rel).toBe(true);
    }
  });

  it("la ruta del fichero coincide con `nivel` y `modulo` del frontmatter", () => {
    for (const ficha of fichasModulo) {
      expect(ficha.data.nivel, ficha.rel).toBe(segmentos(ficha)[1]);
      expect(ficha.data.modulo, ficha.rel).toBe(segmentos(ficha)[2]);
    }
  });

  it("el nivel declarado por cada módulo existe en la colección de niveles", () => {
    for (const ficha of fichasModulo) {
      expect(
        idsNivel.has(ficha.data.nivel),
        `${ficha.rel}: referencia a nivel inexistente «${ficha.data.nivel}»`,
      ).toBe(true);
    }
  });

  it("los identificadores de módulo son únicos en todo el currículo", () => {
    expect(new Set(idsModulo).size).toBe(idsModulo.length);
  });

  it("los prerrequisitos declarados por un módulo son unidades existentes", () => {
    for (const ficha of fichasModulo) {
      for (const previo of (ficha.data.prerrequisitos ?? []) as string[]) {
        expect(
          unidadesConocidas.has(previo),
          `${ficha.rel}: prerrequisito inexistente «${previo}»`,
        ).toBe(true);
      }
    }
  });
});

describe("colección de lecciones", () => {
  it("cada ficha de lección supera su esquema", () => {
    for (const ficha of fichasLeccion) {
      expect(schemaLeccion.safeParse(ficha.data).success, ficha.rel).toBe(true);
    }
  });

  it("la ruta del fichero coincide con `nivel` y `modulo` del frontmatter y su slug es lNN-…", () => {
    for (const ficha of fichasLeccion) {
      expect(ficha.data.nivel, ficha.rel).toBe(segmentos(ficha)[1]);
      expect(ficha.data.modulo, ficha.rel).toBe(segmentos(ficha)[2]);
      expect(slugDeLeccion(ficha), ficha.rel).toMatch(/^l\d{2}-[a-z0-9-]+$/);
    }
  });

  it("cada lección pertenece a un módulo que sí tiene ficha (sin referencias colgando)", () => {
    const modulosExistentes = new Set(idsModulo);
    for (const ficha of fichasLeccion) {
      expect(
        modulosExistentes.has(`${ficha.data.nivel}/${ficha.data.modulo}`),
        `${ficha.rel}: su módulo no tiene index.mdx`,
      ).toBe(true);
    }
  });

  it("dentro de cada módulo, `orden` es único y coincide con el prefijo lNN del fichero", () => {
    const porModulo = new Map<string, Fichero[]>();
    for (const ficha of fichasLeccion) {
      const clave = `${ficha.data.nivel}/${ficha.data.modulo}`;
      porModulo.set(clave, [...(porModulo.get(clave) ?? []), ficha]);
    }
    for (const [clave, grupo] of porModulo) {
      const ordenes = grupo.map((f) => f.data.orden as number);
      expect(new Set(ordenes).size, `órdenes duplicados en ${clave}`).toBe(ordenes.length);
      for (const ficha of grupo) {
        const prefijo = Number(/^l(\d+)-/.exec(slugDeLeccion(ficha))?.[1]);
        expect(
          prefijo,
          `${ficha.rel}: el prefijo del fichero no coincide con orden=${ficha.data.orden}`,
        ).toBe(ficha.data.orden);
      }
    }
  });

  it("los prerrequisitos declarados por una lección son unidades existentes", () => {
    for (const ficha of fichasLeccion) {
      for (const previo of (ficha.data.prerrequisitos ?? []) as string[]) {
        expect(
          unidadesConocidas.has(previo),
          `${ficha.rel}: prerrequisito inexistente «${previo}»`,
        ).toBe(true);
      }
    }
  });

  /**
   * Cuerpo de una lección sin sus bloques de código cercados: las secciones de
   * la plantilla (§6) son secciones del documento, no encabezados `## …` que
   * aparezcan dentro de un ejemplo copiable (p. ej. la plantilla de la nota
   * técnica de n1/m1/l06). H11: decide sobre el documento, no sobre el código.
   */
  function sinBloquesDeCodigo(cuerpo: string): string {
    const fuera: string[] = [];
    let nivel = 0;
    for (const linea of cuerpo.split("\n")) {
      if (nivel === 0) {
        const apertura = linea.match(/^(`{3,})(\S.*)?$/);
        if (apertura) {
          nivel = apertura[1].length;
          continue;
        }
        fuera.push(linea);
        continue;
      }
      const cierre = linea.match(/^(`{3,})\s*$/);
      if (cierre && cierre[1].length >= nivel) nivel = 0;
    }
    return fuera.join("\n");
  }

  it("toda lección declara al menos un ejercicio (sección «## Ejercicio») o es un laboratorio", () => {
    for (const ficha of fichasLeccion) {
      if (ficha.data.tipo === "laboratorio") continue;
      expect(
        /^## Ejercicio$/m.test(sinBloquesDeCodigo(ficha.cuerpo)),
        `${ficha.rel}: falta la sección «## Ejercicio» y no es un laboratorio`,
      ).toBe(true);
    }
  });

  it("toda lección sigue el orden de secciones de la plantilla (CURRICULUM.md §6)", () => {
    const secciones = [
      "Respuesta corta",
      "Conceptos",
      "Ejercicio",
      "Solución explicada",
      "Cómo verificarlo",
      "Errores comunes",
      "Fuentes",
      "Siguientes pasos",
    ];
    for (const ficha of fichasLeccion) {
      if (ficha.data.tipo !== "leccion") continue;
      const posiciones = secciones.map((seccion) =>
        sinBloquesDeCodigo(ficha.cuerpo).search(new RegExp(`^## ${seccion}$`, "m")),
      );
      for (let i = 0; i < secciones.length; i++) {
        expect(
          posiciones[i],
          `${ficha.rel}: falta la sección «## ${secciones[i]}» o aparece desordenada`,
        ).toBeGreaterThanOrEqual(0);
        if (i > 0) {
          expect(posiciones[i], `${ficha.rel}: «${secciones[i]}» fuera de orden`).toBeGreaterThan(
            posiciones[i - 1],
          );
        }
      }
    }
  });

  it("todo módulo con lecciones tiene al menos una unidad con tipo «leccion»", () => {
    const porModulo = new Map<string, Fichero[]>();
    for (const ficha of fichasLeccion) {
      const clave = `${ficha.data.nivel}/${ficha.data.modulo}`;
      porModulo.set(clave, [...(porModulo.get(clave) ?? []), ficha]);
    }
    for (const [clave, grupo] of porModulo) {
      expect(
        grupo.some((f) => f.data.tipo === "leccion"),
        `${clave}: solo tiene laboratorios o ejercicios, sin lección`,
      ).toBe(true);
    }
  });
});

describe("rutas y navegación", () => {
  it("todas las rutas generadas (niveles, módulos y lecciones) son únicas", () => {
    const rutas = [
      ...fichasNivel.map((f) => rutaNivel(idDeNivel(f))),
      ...fichasModulo.map((f) => rutaModulo(f.data.nivel, f.data.modulo)),
      ...fichasLeccion.map((f) => rutaLeccion(f.data.nivel, f.data.modulo, slugDeLeccion(f))),
    ];
    expect(new Set(rutas).size).toBe(rutas.length);
  });

  it("todas las rutas siguen el patrón /curriculo/nN/mK/lNN-slug/ del plan", () => {
    const patron = /^\/curriculo\/n[0-8](\/m[1-9]\d*)?(\/l\d{2}-[a-z0-9-]+)?\/$/;
    expect(rutaNivel("n0")).toMatch(patron);
    expect(rutaModulo("n7", "m6")).toMatch(patron);
    expect(rutaLeccion("n0", "m1", "l01-que-es-programar")).toMatch(patron);
    for (const ficha of fichasModulo)
      expect(rutaModulo(ficha.data.nivel, ficha.data.modulo)).toMatch(patron);
    for (const ficha of fichasLeccion) {
      expect(rutaLeccion(ficha.data.nivel, ficha.data.modulo, slugDeLeccion(ficha))).toMatch(
        patron,
      );
    }
  });

  it("la navegación anterior/siguiente de cada módulo es coherente y simétrica", () => {
    const porModulo = new Map<string, Fichero[]>();
    for (const ficha of fichasLeccion) {
      const clave = `${ficha.data.nivel}/${ficha.data.modulo}`;
      porModulo.set(clave, [...(porModulo.get(clave) ?? []), ficha]);
    }
    for (const [clave, grupo] of porModulo) {
      const unidades = grupo.map((f) => ({
        id: idDeLeccion(f),
        orden: f.data.orden as number,
      }));
      const pares = paresDeNavegacion(unidades);

      expect(pares.length, clave).toBe(unidades.length);
      expect(pares[0].anterior, `${clave}: la primera lección no debe tener anterior`).toBeNull();
      expect(pares.at(-1)?.siguiente, `${clave}: la última no debe tener siguiente`).toBeNull();

      for (let i = 0; i < pares.length - 1; i++) {
        expect(pares[i].siguiente?.id, clave).toBe(pares[i + 1].actual.id);
        expect(pares[i + 1].anterior?.id, clave).toBe(pares[i].actual.id);
      }
    }
  });
});
