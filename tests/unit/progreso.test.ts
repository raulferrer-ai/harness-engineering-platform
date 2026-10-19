import { describe, expect, it } from "vitest";
import {
  alternarLeccion,
  CLAVE_PROGRESO,
  formatearResumen,
  leerProgreso,
  resumenModulo,
  TEXTO_NO_DISPONIBLE,
  type Almacenamiento,
} from "../../src/lib/progreso";

/**
 * Progreso local del hito H4 (IMPLEMENTATION_PLAN.md §5.3). Cubre los dos
 * escenarios exigidos —almacenamiento disponible y no disponible— además de
 * los fallos de lectura/escritura, los datos corruptos y la regla de que un
 * módulo nunca se muestra como completado si no lo está.
 */

class AlmacenFalso implements Almacenamiento {
  datos = new Map<string, string>();
  fallarLectura = false;
  fallarEscritura = false;

  getItem(clave: string): string | null {
    if (this.fallarLectura) throw new Error("Acceso denegado");
    return this.datos.get(clave) ?? null;
  }

  setItem(clave: string, valor: string): void {
    if (this.fallarEscritura) throw new Error("Cuota agotada");
    this.datos.set(clave, valor);
  }
}

const id = "n0/m1/l01-que-es-programar";

describe("lectura del progreso (almacenamiento disponible)", () => {
  it("sin datos devuelve estado disponible y conjunto vacío", () => {
    const lectura = leerProgreso(new AlmacenFalso());
    expect(lectura.estado).toBe("disponible");
    expect(lectura.completadas.size).toBe(0);
  });

  it("lee las unidades marcadas con valor true", () => {
    const almacen = new AlmacenFalso();
    almacen.datos.set(CLAVE_PROGRESO, JSON.stringify({ [id]: true, "n0/m1/l02-x": false }));
    const lectura = leerProgreso(almacen);
    expect(lectura.estado).toBe("disponible");
    expect([...lectura.completadas]).toEqual([id]);
  });

  it("un JSON corrupto se trata como vacío y no como ausencia de almacén", () => {
    const almacen = new AlmacenFalso();
    almacen.datos.set(CLAVE_PROGRESO, "no es json {");
    const lectura = leerProgreso(almacen);
    expect(lectura.estado).toBe("disponible");
    expect(lectura.completadas.size).toBe(0);
  });

  it("un valor que no es un objeto se trata como vacío", () => {
    const almacen = new AlmacenFalso();
    almacen.datos.set(CLAVE_PROGRESO, JSON.stringify([id]));
    expect(leerProgreso(almacen).completadas.size).toBe(0);
    almacen.datos.set(CLAVE_PROGRESO, JSON.stringify(3));
    expect(leerProgreso(almacen).completadas.size).toBe(0);
  });
});

describe("lectura del progreso (almacenamiento no disponible o fallido)", () => {
  it("sin almacén (null) declara no-disponible", () => {
    const lectura = leerProgreso(null);
    expect(lectura.estado).toBe("no-disponible");
    expect(lectura.completadas.size).toBe(0);
  });

  it("cuando getItem lanza (modo privado, políticas) declara no-disponible", () => {
    const almacen = new AlmacenFalso();
    almacen.fallarLectura = true;
    expect(leerProgreso(almacen).estado).toBe("no-disponible");
  });
});

describe("alternar una lección", () => {
  it("marca, persiste con la clave versionada y vuelve a leer idéntico", () => {
    const almacen = new AlmacenFalso();
    const primero = alternarLeccion(leerProgreso(almacen), almacen, id);
    expect(primero.exito).toBe(true);
    expect(primero.completadas.has(id)).toBe(true);
    expect(almacen.datos.has(CLAVE_PROGRESO)).toBe(true);
    expect([...leerProgreso(almacen).completadas]).toEqual([id]);
  });

  it("desmarca al pulsar dos veces y deja el almacén vacío", () => {
    const almacen = new AlmacenFalso();
    alternarLeccion(leerProgreso(almacen), almacen, id);
    const segundo = alternarLeccion(leerProgreso(almacen), almacen, id);
    expect(segundo.exito).toBe(true);
    expect(segundo.completadas.size).toBe(0);
    expect(leerProgreso(almacen).completadas.size).toBe(0);
  });

  it("si la escritura falla, no aplica cambios y lo declara con exito false", () => {
    const almacen = new AlmacenFalso();
    almacen.fallarEscritura = true;
    const resultado = alternarLeccion(leerProgreso(almacen), almacen, id);
    expect(resultado.exito).toBe(false);
    expect(resultado.completadas.size).toBe(0);
    expect(almacen.datos.size).toBe(0);
  });

  it("sin almacén disponible nunca marca", () => {
    const lectura = leerProgreso(null);
    const resultado = alternarLeccion(lectura, null, id);
    expect(resultado.exito).toBe(false);
    expect(resultado.completadas.size).toBe(0);
  });
});

describe("resumen y texto del módulo", () => {
  const lecciones = [
    "n0/m1/l01-que-es-programar",
    "n0/m1/l02-variables",
    "n0/m1/l03-funciones",
    "n0/m1/l04-pruebas",
  ];

  it("cuenta solo las unidades del módulo y calcula el porcentaje", () => {
    const completadas = new Set([lecciones[0], lecciones[1], "n2/m3/l01-ajena"]);
    const resumen = resumenModulo(completadas, lecciones);
    expect(resumen).toEqual({
      completadas: 2,
      total: 4,
      porcentaje: 50,
      completo: false,
    });
  });

  it("un módulo nunca aparece como completado si no lo está", () => {
    const casi = resumenModulo(new Set(lecciones.slice(0, 3)), lecciones);
    expect(casi.completo).toBe(false);
    expect(formatearResumen(casi)).toBe("3 de 4 lecciones · 75 %");
  });

  it("con todas las unidades marcadas sí lo declara", () => {
    const resumen = resumenModulo(new Set(lecciones), lecciones);
    expect(resumen.completo).toBe(true);
    expect(formatearResumen(resumen)).toBe("4 de 4 · Completado");
  });

  it("un módulo sin unidades jamás se da por completado", () => {
    const resumen = resumenModulo(new Set(lecciones), []);
    expect(resumen.completo).toBe(false);
    expect(formatearResumen(resumen)).toBe("0 de 0 lecciones · 0 %");
  });

  it("expone el texto de almacén no disponible", () => {
    expect(TEXTO_NO_DISPONIBLE).toBe("No disponible en este navegador");
  });
});
