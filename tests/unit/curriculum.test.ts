import { describe, expect, it } from "vitest";
import {
  fasesProyecto,
  ordenDeModulo,
  ordenDeNivel,
  ordenarPorOrden,
  paresDeNavegacion,
  rutaDeUnidad,
  rutaLeccion,
  rutaModulo,
  rutaNivel,
} from "../../src/lib/curriculum";

/**
 * Lógica pura del currículo (H2). La integridad de los datos reales ya no se
 * testa aquí (ahora vive en las colecciones): se comprueba en
 * tests/content/curriculo.test.ts contra los ficheros de src/content/.
 */

const idsEsperados = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"];

describe("fases del proyecto longitudinal (temporales, hasta la colección `proyecto`)", () => {
  it("declara las seis fases con niveles válidos", () => {
    expect(fasesProyecto.map((fase) => fase.id)).toEqual(["f1", "f2", "f3", "f4", "f5", "f6"]);
    for (const fase of fasesProyecto) {
      expect(fase.niveles.split(/–|-/).every((n) => idsEsperados.includes(n.trim()))).toBe(true);
    }
  });
});

describe("construcción de rutas del currículo", () => {
  it("genera rutas canónicas con barra final", () => {
    expect(rutaNivel("n0")).toBe("/curriculo/n0/");
    expect(rutaModulo("n0", "m1")).toBe("/curriculo/n0/m1/");
    expect(rutaLeccion("n0", "m1", "l01-que-es-programar")).toBe(
      "/curriculo/n0/m1/l01-que-es-programar/",
    );
  });

  it("rutaDeUnidad resuelve nivel, módulo y lección por su identificador", () => {
    expect(rutaDeUnidad("n3")).toBe("/curriculo/n3/");
    expect(rutaDeUnidad("n3/m2")).toBe("/curriculo/n3/m2/");
    expect(rutaDeUnidad("n3/m2/l04-prueba")).toBe("/curriculo/n3/m2/l04-prueba/");
  });

  it("rutaDeUnidad rechaza identificadores con un número de segmentos incorrecto", () => {
    expect(() => rutaDeUnidad("")).toThrow();
    expect(() => rutaDeUnidad("n0/m1/l01-x/extra")).toThrow();
  });

  it("ordenDeNivel y ordenDeModulo leen el número del identificador", () => {
    expect(ordenDeNivel("n0")).toBe(0);
    expect(ordenDeNivel("n8")).toBe(8);
    expect(ordenDeModulo("m1")).toBe(1);
    expect(ordenDeModulo("m12")).toBe(12);
    expect(ordenDeNivel("raro")).toBe(Number.POSITIVE_INFINITY);
    expect(ordenDeModulo("raro")).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("orden y navegación anterior/siguiente", () => {
  it("ordenarPorOrden ordena ascendente sin mutar la entrada", () => {
    const entrada = [{ orden: 3 }, { orden: 1 }, { orden: 2 }];
    const salida = ordenarPorOrden(entrada);
    expect(salida.map((x) => x.orden)).toEqual([1, 2, 3]);
    expect(entrada.map((x) => x.orden)).toEqual([3, 1, 2]);
  });

  it("con una sola unidad no hay anterior ni siguiente", () => {
    const [par] = paresDeNavegacion([{ id: "a", orden: 1 }]);
    expect(par.anterior).toBeNull();
    expect(par.siguiente).toBeNull();
  });

  it("con lista vacía no hay pares", () => {
    expect(paresDeNavegacion([])).toEqual([]);
  });

  it("la primera unidad no tiene anterior, la última no tiene siguiente y los pares son simétricos", () => {
    const unidades = [
      { id: "l03", orden: 3 },
      { id: "l01", orden: 1 },
      { id: "l02", orden: 2 },
    ];
    const pares = paresDeNavegacion(unidades);

    expect(pares.map((p) => p.actual.id)).toEqual(["l01", "l02", "l03"]);
    expect(pares[0].anterior).toBeNull();
    expect(pares[2].siguiente).toBeNull();

    for (let i = 0; i < pares.length - 1; i++) {
      expect(pares[i].siguiente?.id).toBe(pares[i + 1].actual.id);
      expect(pares[i + 1].anterior?.id).toBe(pares[i].actual.id);
    }
  });
});
