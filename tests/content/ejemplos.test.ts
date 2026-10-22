import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { afterAll, describe, expect, it } from "vitest";

/**
 * H3+H7+H8+H9: los ejemplos de los módulos se comprueban **ejecutándolos** (frente a
 * H2, donde solo se lintiaban). Convención del repositorio:
 *
 * - `ejemplos/*.js` deben terminar con código 0 (verde);
 * - `ejemplos/errores/*.js` fallan a propósito y deben terminar en rojo con su
 *   clase de error (SyntaxError, ReferenceError, TypeError, ERR_MODULE_NOT_FOUND);
 * - los ficheros `.test.js` se ejecutan con el ejecutor de pruebas de Node
 *   (`node --test`), que es exactamente lo que enseñan las lecciones;
 * - H11 añade `n1/m1` (primer módulo conceptual): demos con **solo librería
 *   estándar** que miden límites reales (tokenización, ventana, coste,
 *   sensibilidad) sin red ni claves de API, más el comprobador del entregable;
 * - H12 añade `n0/m6` (pruebas y depuración): demos verdes con `node:test` y
 *   `node:assert/strict` —fronteras, aserciones con mensaje, suite aislada,
 *   ciclo rojo-verde, trazas y reloj/azar inyectados— y 3 rojos deliberados
 *   (AssertionError sin mensaje, estado compartido, TypeError con traza); las
 *   implementaciones `descuento.js`/`presupuesto.js` se verifican por
 *   importación desde sus suites;
 * - H13 añade `n0/m7` (fundamentos web, bucle 127.0.0.1) y H14 `n1/m2`
 *   (tareas pequeñas): demos con solo librería estándar que formulan y
 *   verifican encargos — anatomía, contexto mínimo, criterios primero,
 *   alcance, serie validada y medida— más sus rojos deliberados; las suites
 *   de `tareas/` se ejecutan con `node --test` desde los drivers;
 * - H15 añade `n1/m3` (revisar el código generado): el fixture `entregas/`
 *   con tres entregas (antes/después, suite y manifiesto declarado) y demos
 *   que revisan — dif LCS, ejecución de suites de la entrega, dependencias
 *   declaradas contra usadas, batería de casos límite, checklist de cuatro
 *   criterios con veredicto ACEPTAR/DEVOLVER e informe sobre las tres
 *   entregas— más 5 rojos deliberados (código que no carga, prosa refutada,
 *   dependencia sobrante y caso límite que devuelve basura en silencio);
 * - H16 añade `n1/m4` (flujos de trabajo con asistente): el fixture `sesiones/`
 *   con el registro de 5 sesiones, una transcripción de chat y el mini-proyecto
 *   con sus suites, y demos que controlan las tres superficies — anatomía de
 *   la sesión, análisis de chat, aplicación de parches con Keep/Undo, lista
 *   permitida de comandos, comprobador reejecutable del registro y veredicto
 *   del entregable— más 4 rojos deliberados (chat sin comando, parche roto,
 *   comando fuera de la lista y registro que declara «verificada» con código 1);
 * - H17 añade `n1/m5` (automatizar lo repetible): el fixture `proyecto/` con
 *   sus 4 reglas declaradas en `reglas.json` e implementadas en `reglas.js` y
 *   sus 6 pruebas, y demos que convierten convenciones en reglas — presentador
 *   de convenciones, runner que decide con 0/1, rojos esperados en variantes
 *   rotas, pre-commit instalado en repos temporales, validador de deriva y
 *   certificador del entregable— más 4 rojos deliberados (proyecto infractor
 *   ante el runner, commit bloqueado por el hook, regla declarada sin
 *   comprobación y comprobación sin regla declarada);
 * - el test de cobertura impide que aparezca un ejemplo sin verificar.
 */

const dirEjemplos = fileURLToPath(
  new URL("../../src/content/modulos/n0/m1/ejemplos/", import.meta.url),
);

const dirEjemplosM2 = fileURLToPath(
  new URL("../../src/content/modulos/n0/m2/ejemplos/", import.meta.url),
);

const dirEjemplosM3 = fileURLToPath(
  new URL("../../src/content/modulos/n0/m3/ejemplos/", import.meta.url),
);

const dirEjemplosM4 = fileURLToPath(
  new URL("../../src/content/modulos/n0/m4/ejemplos/", import.meta.url),
);

const dirEjemplosM5 = fileURLToPath(
  new URL("../../src/content/modulos/n0/m5/ejemplos/", import.meta.url),
);

const dirEjemplosN1M1 = fileURLToPath(
  new URL("../../src/content/modulos/n1/m1/ejemplos/", import.meta.url),
);

const dirEjemplosM6 = fileURLToPath(
  new URL("../../src/content/modulos/n0/m6/ejemplos/", import.meta.url),
);

const dirEjemplosM7 = fileURLToPath(
  new URL("../../src/content/modulos/n0/m7/ejemplos/", import.meta.url),
);

const dirEjemplosN1M2 = fileURLToPath(
  new URL("../../src/content/modulos/n1/m2/ejemplos/", import.meta.url),
);

const dirEjemplosN1M3 = fileURLToPath(
  new URL("../../src/content/modulos/n1/m3/ejemplos/", import.meta.url),
);

const dirEjemplosN1M4 = fileURLToPath(
  new URL("../../src/content/modulos/n1/m4/ejemplos/", import.meta.url),
);

const dirEjemplosN1M5 = fileURLToPath(
  new URL("../../src/content/modulos/n1/m5/ejemplos/", import.meta.url),
);

interface Resultado {
  status: number | null;
  stdout: string;
  stderr: string;
}

function ejecutarNode(argumentos: string[], cwd = dirEjemplos): Resultado {
  const resultado = spawnSync(process.execPath, argumentos, {
    cwd,
    encoding: "utf8",
    timeout: 30_000,
  });
  return {
    status: resultado.status,
    stdout: resultado.stdout ?? "",
    stderr: resultado.stderr ?? "",
  };
}

const temporales: string[] = [];
function carpetaTemporal(): string {
  const carpeta = mkdtempSync(join(tmpdir(), "hep-ejemplos-"));
  temporales.push(carpeta);
  return carpeta;
}

afterAll(() => {
  for (const carpeta of temporales) rmSync(carpeta, { recursive: true, force: true });
});

interface CasoDirecto {
  ruta: string;
  codigo: number;
  descripcion: string;
  argumentos?: string[];
  stdoutContiene?: string;
  stderrContiene?: string;
}

/** Casos directos: un fichero, sin preparación, código de salida esperado. */
const casosDirectos: CasoDirecto[] = [
  {
    ruta: "saludo.js",
    codigo: 0,
    stdoutContiene: "Hola, mundo",
    descripcion: "l01: el saludo imprime su salida completa",
  },
  {
    ruta: "saludo-funcion.js",
    codigo: 0,
    descripcion: "l04: el módulo de la función se carga sin errores",
  },
  {
    ruta: "celsius-a-fahrenheit.js",
    codigo: 0,
    descripcion: "l06: la versión corregida se carga sin errores",
  },
  {
    ruta: "comprobar-entorno.js",
    codigo: 0,
    stdoutContiene: "OK: Node",
    descripcion: "l02: el entorno coincide con versiones-esperadas.txt",
  },
  {
    ruta: "errores/sintaxis.js",
    codigo: 1,
    stderrContiene: "SyntaxError",
    descripcion: "l05: SyntaxError a propósito",
  },
  {
    ruta: "errores/roto.js",
    codigo: 1,
    stderrContiene: "ReferenceError",
    descripcion: "l05 (y l01): ReferenceError a propósito",
  },
  {
    ruta: "errores/tipos.js",
    codigo: 1,
    stderrContiene: "TypeError",
    descripcion: "l05: TypeError a propósito",
  },
];

describe("ejemplos del módulo n0/m1: ejecución real", () => {
  it.each(casosDirectos)("$ruta → código $codigo ($descripcion)", (caso) => {
    const resultado = ejecutarNode([caso.ruta]);
    expect(resultado.status, `${caso.ruta} → stderr: ${resultado.stderr}`).toBe(caso.codigo);
    if (caso.stdoutContiene) expect(resultado.stdout).toContain(caso.stdoutContiene);
    if (caso.stderrContiene) expect(resultado.stderr).toContain(caso.stderrContiene);
  });

  it("l01: la salida de saludo.js es exactamente la documentada (4 líneas)", () => {
    const resultado = ejecutarNode(["saludo.js"]);
    expect(resultado.status).toBe(0);
    expect(resultado.stdout).toBe("Hola, mundo\n1. escribir\n2. ejecutar\n3. comprobar\n");
  });

  it("l02: comprobar-entorno.js falla (código 1) si la versión declarada no coincide", () => {
    const carpeta = carpetaTemporal();
    const versionesAntiguas = join(carpeta, "esperadas-antiguas.txt");
    writeFileSync(versionesAntiguas, "node=20.0.0\n");
    const resultado = ejecutarNode(["comprobar-entorno.js", versionesAntiguas]);
    expect(resultado.status).toBe(1);
    expect(resultado.stderr).toContain("Distinta: instalada");
    expect(resultado.stderr).toContain("esperada 20.0.0");
  });

  it("l03: verificar-estructura.js valida una estructura completa y señala los huecos", () => {
    const completa = carpetaTemporal();
    mkdirSync(join(completa, "src"), { recursive: true });
    mkdirSync(join(completa, "pruebas"), { recursive: true });
    writeFileSync(join(completa, "src", "principal.js"), "");
    writeFileSync(join(completa, "pruebas", "principal.test.js"), "");
    writeFileSync(join(completa, "README.md"), "");

    const ok = ejecutarNode(["verificar-estructura.js", completa]);
    expect(ok.status).toBe(0);
    expect(ok.stdout).toContain("OK: estructura completa");

    const vacia = carpetaTemporal();
    const falta = ejecutarNode(["verificar-estructura.js", vacia]);
    expect(falta.status).toBe(1);
    expect(falta.stderr).toContain("Faltan 3 elementos");
    expect(falta.stderr).toContain("src/principal.js");
  });

  it("l04: las pruebas de saludo-funcion pasan con node --test", () => {
    const resultado = ejecutarNode(["--test", "saludo-funcion.test.js"]);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain("pass 3");
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l06: las pruebas de celsius-a-fahrenheit (versión corregida) pasan", () => {
    const resultado = ejecutarNode(["--test", "celsius-a-fahrenheit.test.js"]);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain("pass 3");
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l06: la versión con la fórmula invertida hace fallar 2 de 3 pruebas (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    writeFileSync(
      join(carpeta, "celsius-a-fahrenheit.js"),
      "export function celsiusAFahrenheit(celsius) {\n  return (celsius * 5) / 9 + 32;\n}\n",
    );
    writeFileSync(
      join(carpeta, "celsius-a-fahrenheit.test.js"),
      readFileSync(join(dirEjemplos, "celsius-a-fahrenheit.test.js"), "utf8"),
    );

    const rojo = ejecutarNode(["--test", "celsius-a-fahrenheit.test.js"], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 1");
    expect(rojo.stdout).toContain("fail 2");
    expect(rojo.stdout).toContain("87.5555");
  });
});

/** Casos directos de m2: un fichero, sin preparación, código de salida esperado. */
const casosDirectosM2: CasoDirecto[] = [
  {
    ruta: "tipos.js",
    codigo: 0,
    stdoutContiene: "string number number boolean",
    descripcion: "l01: el mapa de tipos imprime typeof y la trampa de null",
  },
  {
    ruta: "variables.js",
    codigo: 0,
    stdoutContiene: "dentro del bloque: Grace",
    descripcion: "l02: la sombra de ámbito no pisa la variable exterior",
  },
  {
    ruta: "errores/acceso-undefined.js",
    codigo: 1,
    stderrContiene: "TypeError",
    descripcion: "l01: TypeError al leer una propiedad de undefined",
  },
  {
    ruta: "errores/const-reasignada.js",
    codigo: 1,
    stderrContiene: "Assignment to constant variable",
    descripcion: "l02: TypeError al reasignar una const",
  },
  {
    ruta: "errores/tdz.js",
    codigo: 1,
    stderrContiene: "ReferenceError",
    descripcion: "l02: ReferenceError de zona prohibida (TDZ)",
  },
];

describe("ejemplos del módulo n0/m2: ejecución real", () => {
  it.each(casosDirectosM2)("$ruta → código $codigo ($descripcion)", (caso) => {
    const resultado = ejecutarNode([caso.ruta], dirEjemplosM2);
    expect(resultado.status, `${caso.ruta} → stderr: ${resultado.stderr}`).toBe(caso.codigo);
    if (caso.stdoutContiene) expect(resultado.stdout).toContain(caso.stdoutContiene);
    if (caso.stderrContiene) expect(resultado.stderr).toContain(caso.stderrContiene);
  });

  it("l01: la salida de tipos.js es exactamente la documentada (5 líneas)", () => {
    const resultado = ejecutarNode(["tipos.js"], dirEjemplosM2);
    expect(resultado.status).toBe(0);
    expect(resultado.stdout).toBe(
      "string number number boolean\n" +
        "typeof undefined = undefined\n" +
        "typeof null = object (trampa conocida: null se reporta como objeto)\n" +
        "typeof objeto = object\n" +
        '"5" === 5 es false pero "5" == 5 es true\n',
    );
  });

  it("l02: la salida de variables.js es exactamente la documentada (3 líneas)", () => {
    const resultado = ejecutarNode(["variables.js"], dirEjemplosM2);
    expect(resultado.status).toBe(0);
    expect(resultado.stdout).toBe("dentro del bloque: Grace\nfuera del bloque: Ada\ncontador: 1\n");
  });

  const suites: Array<{ fichero: string; pruebas: number }> = [
    { fichero: "normalizar.test.js", pruebas: 4 },
    { fichero: "dinero.test.js", pruebas: 4 },
    { fichero: "dividir.test.js", pruebas: 4 },
    { fichero: "articulo.test.js", pruebas: 5 },
    { fichero: "descripcion-articulo.test.js", pruebas: 3 },
  ];

  it.each(suites)("l03–l07: las pruebas de $fichero pasan con node --test", (suite) => {
    const resultado = ejecutarNode(["--test", suite.fichero], dirEjemplosM2);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain(`pass ${suite.pruebas}`);
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l07: node --test sobre toda la carpeta ejecuta las 20 pruebas del módulo", () => {
    const resultado = ejecutarNode(["--test"], dirEjemplosM2);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain("tests 20");
    expect(resultado.stdout).toContain("pass 20");
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l04: sin Math.round el ruido decimal rompe 1 de 4 pruebas (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    writeFileSync(
      join(carpeta, "dinero.js"),
      readFileSync(join(dirEjemplosM2, "dinero.js"), "utf8").replace(
        "return Math.round(euros * 100);",
        "return euros * 100;",
      ),
    );
    writeFileSync(
      join(carpeta, "dinero.test.js"),
      readFileSync(join(dirEjemplosM2, "dinero.test.js"), "utf8"),
    );

    const rojo = ejecutarNode(["--test", "dinero.test.js"], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 3");
    expect(rojo.stdout).toContain("fail 1");
    expect(rojo.stdout).toContain("30.000000000000004");
  });

  it("l06: sin Object.freeze la prueba de congelación falla (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    writeFileSync(
      join(carpeta, "articulo.js"),
      readFileSync(join(dirEjemplosM2, "articulo.js"), "utf8").replace(
        "return Object.freeze({ nombre: nombre.trim(), precio, cantidad });",
        "return { nombre: nombre.trim(), precio, cantidad };",
      ),
    );
    writeFileSync(
      join(carpeta, "articulo.test.js"),
      readFileSync(join(dirEjemplosM2, "articulo.test.js"), "utf8"),
    );

    const rojo = ejecutarNode(["--test", "articulo.test.js"], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 4");
    expect(rojo.stdout).toContain("fail 1");
    expect(rojo.stdout).toContain("Missing expected exception");
  });
});

/** Casos directos de m3: el script entregable y el error a propósito de l03. */
const casosDirectosM3: CasoDirecto[] = [
  {
    ruta: "demo-informe.js",
    codigo: 0,
    stdoutContiene: "Informe de gastos",
    descripcion: "l07: el script entregable imprime el informe del CSV real",
  },
  {
    ruta: "errores/fuera-de-rango.js",
    codigo: 1,
    stderrContiene: "TypeError",
    descripcion: "l03: TypeError al usar el undefined de un acceso fuera de rango",
  },
];

describe("ejemplos del módulo n0/m3: ejecución real", () => {
  it.each(casosDirectosM3)("$ruta → código $codigo ($descripcion)", (caso) => {
    const resultado = ejecutarNode([caso.ruta], dirEjemplosM3);
    expect(resultado.status, `${caso.ruta} → stderr: ${resultado.stderr}`).toBe(caso.codigo);
    if (caso.stdoutContiene) expect(resultado.stdout).toContain(caso.stdoutContiene);
    if (caso.stderrContiene) expect(resultado.stderr).toContain(caso.stderrContiene);
  });

  it("l07: la salida de demo-informe.js es exactamente la documentada (10 líneas)", () => {
    const resultado = ejecutarNode(["demo-informe.js"], dirEjemplosM3);
    expect(resultado.status).toBe(0);
    expect(resultado.stdout).toBe(
      "Informe de gastos\n" +
        "gastos: 8\n" +
        "total: 83.69 EUR\n" +
        "media: 10.46 EUR\n" +
        "máximo: 42.30 EUR\n" +
        "por categoría:\n" +
        "  comida: 4 gasto(s), 8.00 EUR\n" +
        "  hogar: 1 gasto(s), 42.30 EUR\n" +
        "  ocio: 2 gasto(s), 27.99 EUR\n" +
        "  transporte: 1 gasto(s), 5.40 EUR\n",
    );
  });

  const suites: Array<{ fichero: string; pruebas: number }> = [
    { fichero: "clasificar.test.js", pruebas: 4 },
    { fichero: "acumular.test.js", pruebas: 4 },
    { fichero: "gastos.test.js", pruebas: 4 },
    { fichero: "estadisticas.test.js", pruebas: 4 },
    { fichero: "resumen-categorias.test.js", pruebas: 3 },
    { fichero: "leer-gastos.test.js", pruebas: 6 },
    { fichero: "informe.test.js", pruebas: 3 },
  ];

  it.each(suites)("l01–l07: las pruebas de $fichero pasan con node --test", (suite) => {
    const resultado = ejecutarNode(["--test", suite.fichero], dirEjemplosM3);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain(`pass ${suite.pruebas}`);
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l07: node --test sobre toda la carpeta ejecuta las 28 pruebas del módulo", () => {
    const resultado = ejecutarNode(["--test"], dirEjemplosM3);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain("tests 28");
    expect(resultado.stdout).toContain("pass 28");
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l03: si agregarGasto muta la entrada con push falla 1 de 4 pruebas (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    writeFileSync(
      join(carpeta, "gastos.js"),
      readFileSync(join(dirEjemplosM3, "gastos.js"), "utf8").replace(
        "return [...gastos, gasto];",
        "gastos.push(gasto);\n  return gastos;",
      ),
    );
    writeFileSync(
      join(carpeta, "gastos.test.js"),
      readFileSync(join(dirEjemplosM3, "gastos.test.js"), "utf8"),
    );

    const rojo = ejecutarNode(["--test", "gastos.test.js"], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 3");
    expect(rojo.stdout).toContain("fail 1");
    expect(rojo.stdout).toContain("2 !== 1");
  });

  it("l06: sin saltar la cabecera del CSV fallan 4 de 6 pruebas (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    writeFileSync(
      join(carpeta, "leer-gastos.js"),
      readFileSync(join(dirEjemplosM3, "leer-gastos.js"), "utf8").replace(
        ".slice(1); // la primera es la cabecera",
        ";",
      ),
    );
    mkdirSync(join(carpeta, "datos"), { recursive: true });
    copyFileSync(join(dirEjemplosM3, "datos", "gastos.csv"), join(carpeta, "datos", "gastos.csv"));
    writeFileSync(
      join(carpeta, "leer-gastos.test.js"),
      readFileSync(join(dirEjemplosM3, "leer-gastos.test.js"), "utf8"),
    );

    const rojo = ejecutarNode(["--test", "leer-gastos.test.js"], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 2");
    expect(rojo.stdout).toContain("fail 4");
    expect(rojo.stdout).toContain("leerGastos lee el fichero real del módulo");
  });
});

/** Casos directos de m4: el mini-proyecto, sus utilitarios y sus rojos. */
const casosDirectosM4: CasoDirecto[] = [
  {
    ruta: "convertir.js",
    codigo: 0,
    descripcion: "l01: el módulo se carga sin errores ni efectos",
  },
  {
    ruta: "usar-convertir.js",
    codigo: 0,
    stdoutContiene: "pan: 1.85 EUR",
    descripcion: "l01: la demo importa el módulo y formatea",
  },
  {
    ruta: "revisar-manifiesto.js",
    codigo: 0,
    stdoutContiene: "manifiesto OK",
    descripcion: "l02: el manifiesto real del proyecto cumple su contrato",
  },
  {
    ruta: "dependencias.js",
    codigo: 0,
    stdoutContiene: "lockfile: presente",
    descripcion: "l04: el proyecto no tiene dependencias y su lockfile existe",
  },
  {
    ruta: "candidato.js",
    codigo: 0,
    stdoutContiene: "veredicto: aceptar",
    descripcion: "l05: el candidato de ejemplo se acepta con la fecha base fijada",
  },
  {
    ruta: "revisar-readme.js",
    codigo: 0,
    stdoutContiene: "README OK",
    descripcion: "l06: el README real del proyecto tiene las cinco secciones",
  },
  {
    ruta: "proyecto/src/main.js",
    codigo: 0,
    argumentos: ["proyecto/datos/gastos.csv"],
    stdoutContiene: "total: 83.69 EUR",
    descripcion: "l07: el entregable imprime el informe del CSV real",
  },
  {
    ruta: "proyecto/src/main.js",
    codigo: 1,
    stderrContiene: "Uso: node src/main.js",
    descripcion: "l07: sin argumento el CLI muestra el uso y termina en 1",
  },
  {
    ruta: "errores/import-inesistente.js",
    codigo: 1,
    stderrContiene: "ERR_MODULE_NOT_FOUND",
    descripcion: "l01: import de un módulo que no existe (rojo)",
  },
  {
    ruta: "errores/dependencia-ausente.js",
    codigo: 1,
    stderrContiene: "Cannot find package",
    descripcion: "l04: import de un paquete no instalado (rojo)",
  },
];

describe("ejemplos del módulo n0/m4: ejecución real", () => {
  it.each(casosDirectosM4)("$ruta → código $codigo ($descripcion)", (caso) => {
    const resultado = ejecutarNode([caso.ruta, ...(caso.argumentos ?? [])], dirEjemplosM4);
    expect(resultado.status, `${caso.ruta} → stderr: ${resultado.stderr}`).toBe(caso.codigo);
    if (caso.stdoutContiene) expect(resultado.stdout).toContain(caso.stdoutContiene);
    if (caso.stderrContiene) expect(resultado.stderr).toContain(caso.stderrContiene);
  });

  const suites: Array<{ fichero: string; pruebas: number }> = [
    { fichero: "convertir.test.js", pruebas: 3 },
    { fichero: "revisar-manifiesto.test.js", pruebas: 4 },
    { fichero: "dependencias.test.js", pruebas: 4 },
    { fichero: "candidato.test.js", pruebas: 4 },
    { fichero: "revisar-readme.test.js", pruebas: 3 },
    { fichero: "proyecto/test/proyecto.test.js", pruebas: 6 },
  ];

  it.each(suites)("l01–l07: las pruebas de $fichero pasan con node --test", (suite) => {
    const resultado = ejecutarNode(["--test", suite.fichero], dirEjemplosM4);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain(`pass ${suite.pruebas}`);
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l07: node --test sobre toda la carpeta ejecuta las 24 pruebas del módulo", () => {
    const resultado = ejecutarNode(["--test"], dirEjemplosM4);
    expect(resultado.status, resultado.stdout).toBe(0);
    expect(resultado.stdout).toContain("tests 24");
    expect(resultado.stdout).toContain("pass 24");
    expect(resultado.stdout).toContain("fail 0");
  });

  it("l02: un package.json con JSON roto termina en rojo con TypeError (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    mkdirSync(join(carpeta, "proyecto"), { recursive: true });
    writeFileSync(join(carpeta, "proyecto", "package.json"), '{ "name": "informe-gastos", }\n');

    const rojo = ejecutarNode([join(dirEjemplosM4, "revisar-manifiesto.js")], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("TypeError");
    expect(rojo.stderr).toContain("revisarManifiesto espera un package.json válido (JSON)");
  });

  it("l06: sin la sección «## Cómo verificar» el validador del README sale en rojo (caso registrado)", () => {
    const carpeta = carpetaTemporal();
    mkdirSync(join(carpeta, "proyecto"), { recursive: true });
    const readme = readFileSync(join(dirEjemplosM4, "proyecto", "README.md"), "utf8");
    writeFileSync(join(carpeta, "proyecto", "README.md"), readme.replace("## Cómo verificar", ""));

    const rojo = ejecutarNode([join(dirEjemplosM4, "revisar-readme.js")], carpeta);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("- falta ## Cómo verificar");
  });

  it("l07: con el CSV ausente el entregable informa el error y sale en 1 (caso registrado)", () => {
    const rojo = ejecutarNode(
      ["proyecto/src/main.js", "proyecto/datos/no-existe.csv"],
      dirEjemplosM4,
    );
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("error: no existe el fichero");
  });
});

describe("ejemplos del módulo n0/m5: ejecución real (requiere git)", () => {
  const gitDisponible = spawnSync("git", ["--version"], { encoding: "utf8" }).status === 0;

  interface Demo {
    fichero: string;
    marcas: string[];
    descripcion: string;
  }

  // Las demos crean un repositorio temporal, ejecutan el flujo con Git real
  // (2.50.1 en el entorno de la lección) y terminan con código 0.
  const demos: Demo[] = [
    {
      fichero: "repositorio-proyecto.sh",
      marcas: ["$ git log --oneline --stat", "(árbol limpio: no hay cambios sin registrar)"],
      descripcion: "l01: el proyecto de m4 bajo control de versiones (4 commits)",
    },
    {
      fichero: "revisar-diff.sh",
      marcas: ["$ git diff   # sin preparar", "$ git diff --staged   # preparado"],
      descripcion: "l02: los tres diffs (sin preparar, preparado, entre commits)",
    },
    {
      fichero: "recuperar-versiones.sh",
      marcas: ["$ git restore --staged", "$ git stash push", "$ git reset --hard"],
      descripcion: "l03: restore --staged, stash/pop y recuperación por reflog",
    },
    {
      fichero: "remoto-local.sh",
      marcas: ["$ git remote add origin", "$ git push -u origin", "$ git pull --ff-only"],
      descripcion: "l04: origin como repo bare, push -u, fetch y pull --ff-only",
    },
    {
      fichero: "ramas-feature.sh",
      marcas: ["$ git switch -c anade-cine", "Fusiona anade-cine", "$ git branch -d anade-cine"],
      descripcion: "l05: rama por cambio, fusión --no-ff y borrado de la rama",
    },
    {
      fichero: "revision.sh",
      marcas: ["$ git log ", "..formatea-importes --stat", "$ git diff ", "...formatea-importes"],
      descripcion: "l06: la rama revisada con log y diff de tres puntos",
    },
  ];

  it.skipIf(!gitDisponible).each(demos)(
    "$fichero termina con código 0 y muestra sus pasos ($descripcion)",
    (demo) => {
      const resultado = spawnSync("sh", [demo.fichero], {
        cwd: dirEjemplosM5,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    60_000,
  );

  it.skipIf(!gitDisponible)(
    "flujo-completo.test.js: la suite del entregable pasa con 7 pruebas",
    () => {
      const resultado = spawnSync(process.execPath, ["--test", "flujo-completo.test.js"], {
        cwd: dirEjemplosM5,
        encoding: "utf8",
        timeout: 120_000,
      });
      expect(resultado.status, resultado.stdout).toBe(0);
      expect(resultado.stdout).toContain("pass 7");
      expect(resultado.stdout).toContain("fail 0");
    },
    120_000,
  );

  it.skipIf(!gitDisponible)(
    "errores/conflicto-merge.sh termina en 1 con CONFLICT y marcadores (rojo)",
    () => {
      const resultado = spawnSync("sh", ["errores/conflicto-merge.sh"], {
        cwd: dirEjemplosM5,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(resultado.status).toBe(1);
      expect(resultado.stdout).toContain("CONFLICT (content)");
      expect(resultado.stdout).toContain("<<<<<<<");
      expect(resultado.stdout).toContain(">>>>>>> propuesta-b");
    },
    60_000,
  );

  it.skipIf(!gitDisponible)(
    "errores/push-rechazado.sh termina en 1 con el rechazo del remoto (rojo)",
    () => {
      const resultado = spawnSync("sh", ["errores/push-rechazado.sh"], {
        cwd: dirEjemplosM5,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(resultado.status).toBe(1);
      expect(resultado.stderr).toContain("rejected");
      expect(resultado.stderr).toContain("fetch first");
      expect(resultado.stderr).toContain("error: failed to push some refs");
    },
    60_000,
  );

  it.skipIf(!gitDisponible)(
    "l01: un commit sin cambios termina en 1 con «nothing to commit» (rojo registrado)",
    () => {
      const carpeta = carpetaTemporal();
      spawnSync("git", ["init", "-q"], { cwd: carpeta, encoding: "utf8" });
      spawnSync("git", ["config", "user.name", "Demo"], { cwd: carpeta });
      spawnSync("git", ["config", "user.email", "demo@example.invalid"], { cwd: carpeta });
      const rojo = spawnSync("git", ["commit", "-m", "sin cambios"], {
        cwd: carpeta,
        encoding: "utf8",
      });
      expect(rojo.status).toBe(1);
      expect(rojo.stdout).toContain("nothing to commit");
    },
    30_000,
  );

  it.skipIf(!gitDisponible)(
    "l05: cambiar a una rama inexistente termina en 128 (rojo registrado)",
    () => {
      const carpeta = carpetaTemporal();
      spawnSync("git", ["init", "-q"], { cwd: carpeta, encoding: "utf8" });
      spawnSync("git", ["config", "user.name", "Demo"], { cwd: carpeta });
      spawnSync("git", ["config", "user.email", "demo@example.invalid"], { cwd: carpeta });
      const rojo = spawnSync("git", ["switch", "rama-que-no-existe"], {
        cwd: carpeta,
        encoding: "utf8",
      });
      expect(rojo.status).toBe(128);
      expect(rojo.stderr).toContain("fatal: invalid reference: rama-que-no-existe");
    },
    30_000,
  );
});

describe("l07: la demo de Git (requiere git instalado)", () => {
  const gitDisponible = spawnSync("git", ["--version"], { encoding: "utf8" }).status === 0;

  it.skipIf(!gitDisponible)(
    "demo-git.sh recorre log, diff, revert, rama y fusión sin fallos",
    () => {
      const resultado = spawnSync("sh", ["demo-git.sh"], {
        cwd: dirEjemplos,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      expect(resultado.stdout).toContain("$ git log --oneline");
      expect(resultado.stdout).toContain("$ git diff HEAD~1 HEAD -- saludo.txt");
      expect(resultado.stdout).toContain('Revert "Añade despedida.txt"');
      expect(resultado.stdout).toContain("$ ls");
    },
    60_000,
  );
});

describe("ejemplos del módulo n1/m1: demos ejecutables (solo librería estándar)", () => {
  interface DemoN1M1 {
    fichero: string;
    marcas: string[];
    argumentos?: string[];
    descripcion: string;
  }

  // H11: scripts con solo librería estándar que miden y demuestran límites
  // reales (tokenización, ventana, coste, sensibilidad) sin red ni claves.
  const demos: DemoN1M1[] = [
    {
      fichero: "tokenizar.js",
      marcas: ["tokens: 15", "«harness-engineering-plataforma» → 5 token(s)"],
      descripcion: "l01: la frase medida en tokens y el identificador partido en cinco",
    },
    {
      fichero: "alucinacion-api-inexistente.js",
      marcas: ["Sugerencia del 'modelo':", "getUsuarioAsync", "no está verificado"],
      descripcion: "l02: la API inventada suena plausible antes de ejecutarla",
    },
    {
      fichero: "ventana-contexto.js",
      marcas: ["QUEDA FUERA (se pierde): 692 tokens", "el modelo solo ve el 36.6% del contexto."],
      descripcion: "l03: el desbordamiento de ventana con su porcentaje visible",
    },
    {
      fichero: "coste-contexto.js",
      marcas: ["coste de esta llamada: $ 0.004400", "turno 8: 8780 tokens"],
      descripcion: "l03: el coste por llamada y su crecimiento turno a turno",
    },
    {
      fichero: "sensibilidad-contexto.js",
      marcas: ["respuesta: fs/promises", "respuesta: HTTP", "respuesta: JSON"],
      descripcion: "l04: la misma pregunta, tres contextos, tres respuestas",
    },
    {
      fichero: "comprobar-claim.js",
      marcas: [
        "VERIFICADO — «parsearFilas devuelve siempre un array»",
        "REFUTADO — «parsearFilas valida el número de columnas»",
      ],
      descripcion: "l05: dos claims verificados y uno refutado por ejecución",
    },
    {
      fichero: "comprobar-nota.js",
      argumentos: ["nota-ejemplo.md"],
      marcas: ["NOTA VÁLIDA", "afirmaciones: 3", "fuentes con URL y fecha de consulta: 2"],
      descripcion: "l06: la nota de ejemplo supera su comprobador",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero, ...(demo.argumentos ?? [])], {
        cwd: dirEjemplosN1M1,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  it("errores/api-inexistente.js termina en 1 con TypeError (rojo de l02)", () => {
    const rojo = ejecutarNode(["errores/api-inexistente.js"], dirEjemplosN1M1);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("TypeError");
    expect(rojo.stderr).toContain("getUsuarioAsync is not a function");
  });

  it("errores/ventana-excedida.js termina en 1 con el límite de ventana (rojo de l03)", () => {
    const rojo = ejecutarNode(["errores/ventana-excedida.js"], dirEjemplosN1M1);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("tokens del contexto: 720");
    expect(rojo.stderr).toContain("el contexto excede la ventana (720 > 400)");
  });

  it("errores/claim-refutado.js termina en 1 con el claim refutado (rojo de l05)", () => {
    const rojo = ejecutarNode(["errores/claim-refutado.js"], dirEjemplosN1M1);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("REFUTADO — «parsearFilas valida el número de columnas»");
  });

  it("comprobar-nota.js rechaza una nota sin fechas de consulta con código 1", () => {
    const carpeta = carpetaTemporal();
    writeFileSync(
      join(carpeta, "rota.md"),
      [
        "# Nota rota",
        "",
        "## Pregunta",
        "",
        "¿Funciona esta nota sin fechas?",
        "",
        "## Respuesta corta",
        "",
        "Una respuesta que el comprobador no llega a discutir.",
        "",
        "## Afirmaciones",
        "",
        "1. la primera afirmación",
        "2. la segunda afirmación",
        "3. la tercera afirmación",
        "",
        "## Evidencia",
        "",
        "```text",
        "$ node --version",
        "v24.22.0",
        "```",
        "",
        "## Fuentes",
        "",
        "- [Models](https://platform.openai.com/docs/models)",
        "- [Pricing](https://platform.openai.com/docs/pricing)",
        "",
      ].join("\n"),
    );
    const rojo = spawnSync(process.execPath, ["comprobar-nota.js", join(carpeta, "rota.md")], {
      cwd: dirEjemplosN1M1,
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("NOTA NO VÁLIDA");
    expect(rojo.stderr).toContain("fuente sin fecha de consulta");
  });
});

describe("ejemplos del módulo n0/m6: pruebas y depuración", () => {
  interface DemoM6 {
    fichero: string;
    marcas: string[];
    descripcion: string;
  }

  // H12: demos verdes con solo librería estándar: fronteras, aserciones,
  // suites node:test, ciclo rojo-verde, trazas y determinismo (reloj/semilla).
  const demos: DemoM6[] = [
    {
      fichero: "casos-limite.js",
      marcas: ["6 de 6 casos en verde"],
      descripcion: "l01: la batería de fronteras termina en verde",
    },
    {
      fichero: "aserciones-intencion.js",
      marcas: ["4 aserciones en verde: estricta, profunda, excepción y texto"],
      descripcion: "l02: las cuatro familias de aserción con mensaje",
    },
    {
      fichero: "descuento.test.js",
      marcas: ["pass 6", "fail 0"],
      descripcion: "l03: la suite aislada con beforeEach (6 pruebas)",
    },
    {
      fichero: "ciclo-rojo-verde.js",
      marcas: ["ciclo completo: rojo (1) → verde (0)"],
      descripcion: "l04: el ciclo TDD con sus dos códigos de salida",
    },
    {
      fichero: "leer-traza.js",
      marcas: ["clase: TypeError", "primer frame de TU código: interna"],
      descripcion: "l05: la traza parseada hasta el primer frame propio",
    },
    {
      fichero: "reloj-inyectado.js",
      marcas: ["4 aserciones en verde con el reloj y el azar inyectados", "corrida 2: 0.2388"],
      descripcion: "l06: reloj inyectado y azar con semilla reproducible",
    },
    {
      fichero: "presupuesto.test.js",
      marcas: ["pass 8", "fail 0"],
      descripcion: "l07: la suite del entregable (8 pruebas)",
    },
    {
      fichero: "entregable-rojo-verde.js",
      marcas: ["entregable válido", "pass 7", "fail 1"],
      descripcion: "l07: la misma suite en rojo con el bug y en verde sin él",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero], {
        cwd: dirEjemplosM6,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  it("errores/asercion-sin-mensaje.js termina en 1 con AssertionError (rojo de l02)", () => {
    const rojo = ejecutarNode(["errores/asercion-sin-mensaje.js"], dirEjemplosM6);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("AssertionError");
    expect(rojo.stderr).toContain("actual: 450");
    expect(rojo.stderr).toContain("expected: 544.5");
  });

  it("errores/estado-compartido.js termina en 1 con pass 1 / fail 1 (rojo de l03)", () => {
    const rojo = ejecutarNode(["errores/estado-compartido.js"], dirEjemplosM6);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 1");
    expect(rojo.stdout).toContain("fail 1");
    expect(rojo.stdout).toContain("cada prueba debería partir de cero");
  });

  it("errores/traza-perdida.js termina en 1 con TypeError de tres frames (rojo de l05)", () => {
    const rojo = ejecutarNode(["errores/traza-perdida.js"], dirEjemplosM6);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("TypeError: Cannot read properties of null");
    expect(rojo.stderr).toContain("at interna");
    expect(rojo.stderr).toContain("at mediate");
    expect(rojo.stderr).toContain("at principal");
  });
});

describe("ejemplos del módulo n0/m7: fundamentos web", () => {
  interface DemoM7 {
    fichero: string;
    marcas: string[];
    descripcion: string;
  }

  // H13: demos verdes con solo librería estándar (bucle 127.0.0.1, sin red
  // externa): validador de HTML, árbol DOM, cascada, HTTP, servidor estático,
  // estilos calculados y el entregable rojo→verde con su suite.
  const demos: DemoM7[] = [
    {
      fichero: "validar-html.js",
      marcas: ["10 comprobaciones en verde"],
      descripcion: "l01: las diez comprobaciones de la página en verde",
    },
    {
      fichero: "arbol-dom.js",
      marcas: ["árbol construido: 30 elementos y 12 nodos de texto"],
      descripcion: "l02: la página convertida en árbol y contada",
    },
    {
      fichero: "especificidad.js",
      marcas: [
        "color de p.destacado → #b3261e ← .destacado (orden 4)",
        "color de nav a → #1a4fa0 ← nav a (orden 9)",
        "font-size del p del pie → 0.875rem ← #pie p (orden 7)",
      ],
      descripcion: "l03: la cascada resuelta en sus tres casos",
    },
    {
      fichero: "peticion-http.js",
      marcas: ["content-type: text/html; charset=utf-8", "2 comprobaciones HTTP en verde"],
      descripcion: "l04: anatomía de petición y respuesta con content-length verificado",
    },
    {
      fichero: "servidor-estatico.js",
      marcas: ["✓ /%2e%2e/secreto.txt → 403", "5 rutas comprobadas en verde"],
      descripcion: "l05: rutas, MIME y bloqueo del escape del directorio",
    },
    {
      fichero: "ruta-critica.js",
      marcas: ["9 elementos con reglas de autor y 21 solo con la hoja del agente"],
      descripcion: "l06: la cascada resuelta con la fuente de cada propiedad",
    },
    {
      fichero: "pagina.test.js",
      marcas: ["pass 10", "fail 0"],
      descripcion: "l07: la suite del entregable (10 pruebas)",
    },
    {
      fichero: "entregable-pagina.js",
      marcas: ["entregable válido", "pass 5", "fail 5", "pass 10", "fail 0"],
      descripcion: "l07: la misma suite en rojo con la página rota y en verde con la buena",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero], {
        cwd: dirEjemplosM7,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  it("errores/html-invalido.js termina en 1 con seis comprobaciones en rojo (rojo de l01)", () => {
    const rojo = ejecutarNode(["errores/html-invalido.js"], dirEjemplosM7);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("✗ html con lang — falta <html lang=…>");
    expect(rojo.stdout).toContain("✗ encabezados sin saltos — salto de h1 a h3");
    expect(rojo.stdout).toContain("✗ imágenes con alt — 1 sin alt");
    expect(rojo.stdout).toContain("6 comprobaciones en rojo; 4 en verde");
  });

  it("errores/css-roto.js termina en 1 con el Error de sintaxis y su línea (rojo de l03)", () => {
    const rojo = ejecutarNode(["errores/css-roto.js"], dirEjemplosM7);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("Error: CSS inválido en la línea 3: declaración sin «:»");
    expect(rojo.stderr).toContain("«color red»");
  });

  it("errores/ruta-404.js termina en 1 con el 404 esperado (rojo de l04)", () => {
    const rojo = ejecutarNode(["errores/ruta-404.js"], dirEjemplosM7);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("GET /pagina-que-no-existe.html → 404");
    expect(rojo.stderr).toContain("esperado 200, recibido 404");
  });
});

describe("ejemplos del módulo n1/m2: tareas pequeñas (solo librería estándar)", () => {
  interface DemoN1M2 {
    fichero: string;
    marcas: string[];
    argumentos?: string[];
    descripcion: string;
  }

  // H14: scripts con solo librería estándar que formulan y verifican encargos:
  // anatomía, contexto mínimo medido en palabras, criterios en rojo→verde,
  // alcance, la serie del entregable, su validador y su medición real.
  const demos: DemoN1M2[] = [
    {
      fichero: "anatomia.js",
      marcas: ["anatomía correcta: 3 de 3 tareas", "✓ tarea-1: instrucción (149 caracteres)"],
      descripcion: "l01: las tres tareas con anatomía correcta",
    },
    {
      fichero: "contexto-minimo.js",
      marcas: [
        "piezas seleccionadas: 3 de 5",
        "palabras del contexto: 27 (con el ruido serían 60)",
      ],
      descripcion: "l02: el contexto mínimo contado en palabras frente al ruido",
    },
    {
      fichero: "criterios-primero.js",
      marcas: [
        "pass 1 · fail 3",
        "pass 4 · fail 0",
        "borrador refutado en 3 criterios; entrega verificada en 4",
      ],
      descripcion: "l03: la misma suite contra el borrador (rojo) y la entrega (verde)",
    },
    {
      fichero: "alcance.js",
      marcas: ["✓ alcance respetado: 1 archivo tocado, dentro de los 1 permitidos"],
      descripcion: "l04: la entrega queda dentro de los archivos permitidos",
    },
    {
      fichero: "serie.js",
      marcas: [
        "serie de 3 tareas · 11 criterios · 3 comandos de verificación",
        "tarea-3 — Suma con dos decimales exactos (3 criterios)",
      ],
      descripcion: "l06: la serie del entregable con sus tres tareas",
    },
    {
      fichero: "comprobar-serie.js",
      marcas: ["serie válida: 3 tareas, 11 criterios, 3 comandos de verificación"],
      descripcion: "l06: el validador aprueba la serie de referencia",
    },
    {
      fichero: "verificacion-rapida.js",
      marcas: ["verificación total: ", "3 tareas verificables en mucho menos de 10 minutos"],
      descripcion: "l05: los comandos de la serie ejecutados y medidos en ms",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero, ...(demo.argumentos ?? [])], {
        cwd: dirEjemplosN1M2,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  it("errores/tarea-ambigua.js termina en 1 con la anatomía rota (rojo de l01)", () => {
    const rojo = ejecutarNode(["errores/tarea-ambigua.js"], dirEjemplosN1M2);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("instrucción vaga (17 caracteres; el curso exige 40)");
    expect(rojo.stderr).toContain("sin entregable nombrable");
  });

  it("errores/contexto-inflado.js termina en 1 con las piezas innecesarias (rojo de l02)", () => {
    const rojo = ejecutarNode(["errores/contexto-inflado.js"], dirEjemplosN1M2);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("contexto refutado: 2 piezas no son necesarias para esta tarea");
  });

  it("errores/alcance-excedido.js termina en 1 con archivos fuera de la frontera (rojo de l04)", () => {
    const rojo = ejecutarNode(["errores/alcance-excedido.js"], dirEjemplosN1M2);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain(
      "archivos tocados por la entrega:  src/gastos.js, src/informe.js, test/gastos.test.js, README.md",
    );
    expect(rojo.stderr).toContain(
      "alcance refutado: 3 de 4 archivos tocados no estaban permitidos",
    );
  });

  it("comprobar-serie.js rechaza la serie rota con 6 incidencias (rojo de l06)", () => {
    const rojo = ejecutarNode(["comprobar-serie.js", "errores/serie-rota.js"], dirEjemplosN1M2);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("serie NO válida: 6 incidencias");
    expect(rojo.stderr).toContain(
      "tarea-b: verificación «abre el navegador y comprueba a mano que va más rápido» no es un comando node --test",
    );
  });

  it("las tres suites de tareas/ pasan en verde y el borrador cae en rojo", () => {
    for (const tarea of ["tarea-1", "tarea-2", "tarea-3"]) {
      const verde = ejecutarNode(["--test", `tareas/${tarea}.test.js`], dirEjemplosN1M2);
      expect(verde.status, verde.stderr).toBe(0);
      expect(verde.stdout).toContain("fail 0");
    }
    const rojo = spawnSync(process.execPath, ["--test", "tareas/tarea-1.test.js"], {
      cwd: dirEjemplosN1M2,
      env: { ...process.env, BORRADOR: "1" },
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("fail 3");
  });
});

describe("ejemplos del módulo n1/m3: revisar el código generado (solo librería estándar)", () => {
  interface DemoN1M3 {
    fichero: string;
    marcas: string[];
    argumentos?: string[];
    descripcion: string;
  }

  // H15: el fixture entregas/ (tres entregas con antes/después, suite y
  // manifiesto declarado) y las demos que lo revisan: dif LCS, suites de la
  // entrega, dependencias declaradas contra usadas, casos límite de la tarea,
  // el checklist de 4 criterios y el informe sobre las tres entregas.
  const demos: DemoN1M3[] = [
    {
      fichero: "diff.js",
      marcas: [
        "diff: 2 líneas añadidas, 3 quitadas, 4 iguales",
        "✓ el código entregado se carga sin errores",
      ],
      descripcion: "l01: el dif de gastos y su código cargado",
    },
    {
      fichero: "pruebas-entrega.js",
      marcas: [
        "gastos: pass 4 · fail 0 → suite en verde",
        "informes: pass 3 · fail 1 → suite en rojo",
      ],
      descripcion: "l02: las tres suites ejecutadas con su pass/fail",
    },
    {
      fichero: "dependencias.js",
      marcas: [
        "✓ gastos: sin dependencias nuevas",
        "✗ fechas: nueva dependencia «dayjs» — el código NO la importa (sobrante)",
      ],
      descripcion: "l03: la dependencia sobrante de fechas señalada",
    },
    {
      fichero: "casos-limite.js",
      marcas: ["informes: 2 de 3 casos límite en verde", "fechas: 4 de 4 casos límite en verde"],
      descripcion: "l04: la batería de fronteras con informes en rojo",
    },
    {
      fichero: "checklist.js",
      marcas: ["veredicto: ACEPTAR (0 incidencias)"],
      descripcion: "l05: el checklist acepta la entrega limpia",
    },
    {
      fichero: "checklist.js",
      argumentos: ["informes"],
      marcas: ["veredicto: DEVOLVER (2 incidencia(s))"],
      descripcion: "l05: el checklist devuelve informes con dos incidencias",
    },
    {
      fichero: "checklist.js",
      argumentos: ["fechas"],
      marcas: [
        "✗ criterio (dependencias): dependencia(s) declarada(s) sin usarse: dayjs",
        "veredicto: DEVOLVER (1 incidencia(s))",
      ],
      descripcion: "l05: el checklist devuelve fechas por su dependencia",
    },
    {
      fichero: "revisar-entregas.js",
      marcas: ["resumen: 1 aceptada(s), 2 devuelta(s)", "✓ ACEPTAR  gastos"],
      descripcion: "l06: el informe completo sobre las tres entregas",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero, ...(demo.argumentos ?? [])], {
        cwd: dirEjemplosN1M3,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  it("errores/despues-roto.js termina en 1 con SyntaxError (rojo de l01)", () => {
    const rojo = ejecutarNode(["errores/despues-roto.js"], dirEjemplosN1M3);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("SyntaxError");
    expect(rojo.stderr).toContain("Unexpected end of input");
  });

  it("errores/comprobar-carga.js devuelve la entrega que no carga (rojo de l01)", () => {
    const rojo = ejecutarNode(["errores/comprobar-carga.js"], dirEjemplosN1M3);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("entrega que no carga: SyntaxError: Unexpected end of input");
  });

  it("errores/revision-cegada.js refuta la prosa con la suite (rojo de l02)", () => {
    const rojo = ejecutarNode(["errores/revision-cegada.js"], dirEjemplosN1M3);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("suite ejecutada: pass 3 · fail 1");
    expect(rojo.stderr).toContain(
      "claim REFUTADO: la descripción dice «las 4 pruebas pasan» pero 1 falla",
    );
  });

  it("errores/dependencia-sobrante.js devuelve la dependencia sin usar (rojo de l03)", () => {
    const rojo = ejecutarNode(["errores/dependencia-sobrante.js"], dirEjemplosN1M3);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("nueva dependencia declarada: «dayjs» — el código NO la importa");
    expect(rojo.stderr).toContain("DEVOLVER: «dayjs» no aparece en el código de la entrega");
  });

  it("errores/caso-limite-silencioso.js devuelve la basura silenciosa (rojo de l04)", () => {
    const rojo = ejecutarNode(["errores/caso-limite-silencioso.js"], dirEjemplosN1M3);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("lo que devuelve la entrega: top=-Infinity, media=NaN");
    expect(rojo.stderr).toContain(
      "DEVOLVER: el caso límite devuelve valores incorrectos en silencio",
    );
  });

  it("las suites de las entregas: gastos y fechas en verde, informes con fail 1", () => {
    for (const id of ["gastos", "fechas"]) {
      const verde = ejecutarNode(["--test", `entregas/${id}.test.js`], dirEjemplosN1M3);
      expect(verde.status, verde.stderr).toBe(0);
      expect(verde.stdout).toContain("fail 0");
    }
    const rojo = ejecutarNode(["--test", "entregas/informes.test.js"], dirEjemplosN1M3);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("pass 3");
    expect(rojo.stdout).toContain("fail 1");
  });

  it("l06: con los dos arreglos aplicados, la revisión completa queda en 3 ACEPTAR", () => {
    const carpeta = carpetaTemporal();
    for (const fichero of readdirSync(dirEjemplosN1M3)) {
      if (fichero.endsWith(".js"))
        copyFileSync(join(dirEjemplosN1M3, fichero), join(carpeta, fichero));
    }
    mkdirSync(join(carpeta, "entregas"));
    for (const fichero of readdirSync(join(dirEjemplosN1M3, "entregas"))) {
      copyFileSync(join(dirEjemplosN1M3, "entregas", fichero), join(carpeta, "entregas", fichero));
    }

    const informes = join(carpeta, "entregas", "informes-despues.js");
    writeFileSync(
      informes,
      readFileSync(informes, "utf8").replace(
        "export function resumen(importes) {\n  const top",
        "export function resumen(importes) {\n  if (importes.length === 0) return { top: null, media: 0 };\n  const top",
      ),
    );
    const datos = join(carpeta, "entregas", "datos.js");
    writeFileSync(
      datos,
      readFileSync(datos, "utf8").replace(
        'dependenciasDespues: ["dayjs"]',
        "dependenciasDespues: []",
      ),
    );

    const verde = ejecutarNode(["revisar-entregas.js"], carpeta);
    expect(verde.status, verde.stderr).toBe(0);
    expect(verde.stdout).toContain("resumen: 3 aceptada(s), 0 devuelta(s)");
  });
});

describe("ejemplos del módulo n1/m4: flujos de trabajo con asistente (solo librería estándar)", () => {
  interface DemoN1M4 {
    fichero: string;
    marcas: string[];
    argumentos?: string[];
    descripcion: string;
  }

  // H16: el fixture sesiones/ (registro de 5 sesiones, transcripción de chat y
  // mini-proyecto con sus suites) y las demos que controlan las tres
  // superficies: anatomía de la sesión, análisis de chat, parches con
  // Keep/Undo, lista permitida de comandos, comprobador reejecutable y
  // veredicto del entregable.
  const demos: DemoN1M4[] = [
    {
      fichero: "sesiones.js",
      marcas: [
        "anatomía correcta: 5 sesiones con sus 7 campos · superficies: chat 2, inline 1, terminal 2",
      ],
      descripcion: "l01: el registro con su anatomía y sus tres superficies",
    },
    {
      fichero: "analizar-chat.js",
      marcas: [
        "chat válido: objetivo «crear la función suma con su prueba»",
        "verificación ejecutada: node --test suma.test.js",
      ],
      descripcion: "l02: la transcripción de ejemplo cierra con evidencia",
    },
    {
      fichero: "edicion-inline.js",
      marcas: [
        "suite antes del parche: pass 0 · fail 3",
        "suite después del parche: pass 3 · fail 0",
        "✓ parche aplicado y verificado (Keep)",
      ],
      descripcion: "l03: el parche de total() aplicado y verificado con la suite",
    },
    {
      fichero: "comandos-permitidos.js",
      marcas: ["propuestas del asistente de terminal: 5", "ejecutados: 3 · rechazados: 2"],
      descripcion: "l04: la lista permitida ejecuta 3 y rechaza 2 propuestas",
    },
    {
      fichero: "comprobar-registro.js",
      marcas: ["registro válido: 5 sesiones, 5 comandos reejecutados, 21 pruebas en verde"],
      descripcion: "l05: el registro reejecutado completo en verde",
    },
    {
      fichero: "verificar-sesiones.js",
      marcas: [
        "pruebas en verde: 21 (0 en rojo)",
        "entregable válido: registro de 5 sesiones con verificación",
      ],
      descripcion: "l06: el veredicto del entregable en verde",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero, ...(demo.argumentos ?? [])], {
        cwd: dirEjemplosN1M4,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  it("errores/chat-listo-sin-comando.js termina en 1 con 3 incidencias (rojo de l02)", () => {
    const rojo = ejecutarNode(["errores/chat-listo-sin-comando.js"], dirEjemplosN1M4);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("chat NO válido: 3 incidencia(s)");
    expect(rojo.stderr).toContain("sin comando de verificación ejecutado (node --test)");
    expect(rojo.stderr).toContain("sin «codigo=0» al cierre de la sesión");
  });

  it("errores/parche-roto.js termina en 1 con pass 2 · fail 1 (rojo de l03)", () => {
    const rojo = ejecutarNode(["errores/parche-roto.js"], dirEjemplosN1M4);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("suite con el parche propuesto: pass 2 · fail 1");
    expect(rojo.stderr).toContain("✗ parche en rojo: no se aplica (Undo)");
  });

  it("errores/comando-fuera-de-lista.js termina en 1 con el push rechazado (rojo de l04)", () => {
    const rojo = ejecutarNode(["errores/comando-fuera-de-lista.js"], dirEjemplosN1M4);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain(
      "comando rechazado: «git push --force origin main» no está en la lista permitida",
    );
  });

  it("errores/sesion-sin-verificar.js termina en 1 con las 2 incidencias de s4 (rojo de l05)", () => {
    const rojo = ejecutarNode(["errores/sesion-sin-verificar.js"], dirEjemplosN1M4);
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("registro NO válido: 2 incidencia(s)");
    expect(rojo.stderr).toContain("s4: el comando devolvió 0, el registro declara 1");
    expect(rojo.stderr).toContain("s4: veredicto «verificada» con código de salida 1");
  });

  it("las suites del mini-proyecto pasan en verde y el proyecto entero ejecuta 6 pruebas", () => {
    for (const fichero of ["suma.test.js", "total.test.js"]) {
      const verde = ejecutarNode(
        ["--test", fichero],
        join(dirEjemplosN1M4, "sesiones", "proyecto"),
      );
      expect(verde.status, verde.stderr).toBe(0);
      expect(verde.stdout).toContain("fail 0");
    }
    const completo = ejecutarNode(["--test"], join(dirEjemplosN1M4, "sesiones", "proyecto"));
    expect(completo.status, completo.stdout).toBe(0);
    expect(completo.stdout).toContain("tests 6");
    expect(completo.stdout).toContain("pass 6");
    expect(completo.stdout).toContain("fail 0");
  });

  it("comprobar-registro.js sobre el registro declarado con código 1 sale en rojo", () => {
    const rojo = ejecutarNode(
      ["comprobar-registro.js", "errores/registro-sin-verificar.json"],
      dirEjemplosN1M4,
    );
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("s4: el comando devolvió 0, el registro declara 1");
  });

  it("l06: corromper s2 devuelve el entregable y repararlo lo certifica de nuevo", () => {
    const carpeta = carpetaTemporal();
    mkdirSync(join(carpeta, "sesiones"), { recursive: true });
    for (const fichero of ["sesiones.js", "comprobar-registro.js", "verificar-sesiones.js"]) {
      copyFileSync(join(dirEjemplosN1M4, fichero), join(carpeta, fichero));
    }
    for (const fichero of ["registro.json"]) {
      copyFileSync(join(dirEjemplosN1M4, "sesiones", fichero), join(carpeta, "sesiones", fichero));
    }
    mkdirSync(join(carpeta, "sesiones", "proyecto"), { recursive: true });
    for (const fichero of readdirSync(join(dirEjemplosN1M4, "sesiones", "proyecto"))) {
      copyFileSync(
        join(dirEjemplosN1M4, "sesiones", "proyecto", fichero),
        join(carpeta, "sesiones", "proyecto", fichero),
      );
    }

    const corrupto = join(carpeta, "registro-corrupto.json");
    writeFileSync(
      corrupto,
      readFileSync(join(carpeta, "sesiones", "registro.json"), "utf8").replace(
        '"id": "s2",\n      "superficie": "inline",\n      "objetivo": "Que total() devuelva número, no texto, con la lista vacía cubierta",\n      "cambio": "Parche aplicado a proyecto/total.js: guarda de lista vacía y Math.round en vez de toFixed",\n      "comando": "node --test total.test.js",\n      "codigoSalida": 0,',
        '"id": "s2",\n      "superficie": "inline",\n      "objetivo": "Que total() devuelva número, no texto, con la lista vacía cubierta",\n      "cambio": "Parche aplicado a proyecto/total.js: guarda de lista vacía y Math.round en vez de toFixed",\n      "comando": "node --test total.test.js",\n      "codigoSalida": 1,',
      ),
    );

    const rojo = spawnSync(process.execPath, ["verificar-sesiones.js", corrupto], {
      cwd: carpeta,
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(rojo.status).toBe(1);
    expect(rojo.stderr).toContain("entregable NO válido: 2 incidencia(s)");
    expect(rojo.stderr).toContain("s2: el comando devolvió 0, el registro declara 1");

    writeFileSync(
      corrupto,
      readFileSync(corrupto, "utf8").replace(
        '"comando": "node --test total.test.js",\n      "codigoSalida": 1,',
        '"comando": "node --test total.test.js",\n      "codigoSalida": 0,',
      ),
    );
    const verde = spawnSync(process.execPath, ["verificar-sesiones.js", corrupto], {
      cwd: carpeta,
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(verde.status, verde.stderr).toBe(0);
    expect(verde.stdout).toContain("entregable válido: registro de 5 sesiones con verificación");
  });
});

describe("ejemplos del módulo n1/m5: automatizar lo repetible (reglas + pre-commit)", () => {
  const gitDisponible = spawnSync("git", ["--version"], { encoding: "utf8" }).status === 0;

  interface DemoN1M5 {
    fichero: string;
    marcas: string[];
    descripcion: string;
  }

  // H17: el fixture proyecto/ (4 reglas declaradas e implementadas, 6 pruebas)
  // y las demos que convierten convenciones en reglas: presentación, runner,
  // rojos esperados, pre-commit en repos temporales, validador de deriva y
  // certificación del entregable. Las demos con git se saltan si no hay git.
  const demos: DemoN1M5[] = [
    {
      fichero: "convenciones.js",
      marcas: ["4 reglas de 4 con comprobación — todas son ejecutables"],
      descripcion: "l01: las 4 convenciones declaradas y comprobadas",
    },
    {
      fichero: "comprobar.js",
      marcas: ["4 reglas en verde — el runner permite el commit"],
      descripcion: "l02: el runner ejecuta las 4 reglas y permite el commit",
    },
    {
      fichero: "ver-rojos.js",
      marcas: ["3 infracciones detectadas, ninguna pasó en silencio"],
      descripcion: "l03: las tres variantes rotas detectadas con sus reglas",
    },
    {
      fichero: "validar-reglas.js",
      marcas: ["deriva: 0 — declarado y ejecutado coinciden"],
      descripcion: "l05: sin deriva entre declarado e implementado",
    },
  ];

  it.each(demos)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero], {
        cwd: dirEjemplosN1M5,
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    30_000,
  );

  const demosConGit: DemoN1M5[] = [
    {
      fichero: "instalar-hook.js",
      marcas: ["modo 755", "4 reglas en verde — el runner permite el commit", "commit creado ("],
      descripcion: "l04: el hook instalado deja pasar el commit limpio",
    },
    {
      fichero: "entregable.js",
      marcas: [
        "reglas: 4 declaradas, 4 comprobaciones, deriva 0",
        "commit limpio: pasado (git exit 0)",
        "commit con src/informe.js sin prueba: bloqueado (git exit 1)",
        "entregable válido: reglas del repositorio + pre-commit",
      ],
      descripcion: "l06: las tres condiciones del entregable certificadas",
    },
  ];

  it.skipIf(!gitDisponible).each(demosConGit)(
    "$fichero termina con código 0 y muestra sus marcas ($descripcion)",
    (demo) => {
      const resultado = spawnSync(process.execPath, [demo.fichero], {
        cwd: dirEjemplosN1M5,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(resultado.status, resultado.stderr).toBe(0);
      for (const marca of demo.marcas) {
        expect(resultado.stdout, `${demo.fichero} → falta «${marca}»`).toContain(marca);
      }
    },
    60_000,
  );

  it("errores/incumplimiento-detectado.js termina en 1 con r1 en rojo (rojo de l02/l03)", () => {
    const rojo = ejecutarNode(["errores/incumplimiento-detectado.js"], dirEjemplosN1M5);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("✗ r1: src/total.js sin test/total.test.js");
    expect(rojo.stdout).toContain("1 de 4 reglas en rojo — el runner no permite el commit");
    expect(rojo.stdout).toContain("$ node comprobar.js  →  exit 1");
  });

  it.skipIf(!gitDisponible)(
    "errores/commit-bloqueado.js termina en 1 con el commit abortado (rojo de l04)",
    () => {
      const rojo = spawnSync(process.execPath, ["errores/commit-bloqueado.js"], {
        cwd: dirEjemplosN1M5,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(rojo.status).toBe(1);
      expect(rojo.stdout).toContain("✗ r1: src/informe.js sin test/informe.test.js");
      expect(rojo.stdout).toContain("1 de 4 reglas en rojo — el runner no permite el commit");
      expect(rojo.stdout).toContain("git exit 1");
      expect(rojo.stdout).toContain(
        "commit bloqueado por el pre-commit: src/informe.js sin test/informe.test.js",
      );
    },
    60_000,
  );

  it("errores/regla-sin-comprobacion.js termina en 1 con la deriva declarada (rojo de l05)", () => {
    const rojo = ejecutarNode(["errores/regla-sin-comprobacion.js"], dirEjemplosN1M5);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("✗ r5: regla declarada sin comprobación");
    expect(rojo.stdout).toContain(
      "el validador se niega a ejecutar una regla que sólo existe en papel",
    );
  });

  it("errores/comprobacion-sin-regla.js termina en 1 con la deriva invertida (rojo de l05)", () => {
    const rojo = ejecutarNode(["errores/comprobacion-sin-regla.js"], dirEjemplosN1M5);
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("✗ r4: comprobación implementada sin regla declarada");
    expect(rojo.stdout).toContain(
      "una comprobación sin regla declarada es código muerto con apariencia de control",
    );
  });

  it("las suites del mini-proyecto pasan en verde y el proyecto entero ejecuta 6 pruebas", () => {
    for (const fichero of ["saludo.test.js", "total.test.js"]) {
      const verde = ejecutarNode(["--test", `test/${fichero}`], join(dirEjemplosN1M5, "proyecto"));
      expect(verde.status, verde.stderr).toBe(0);
      expect(verde.stdout).toContain("fail 0");
    }
    const completo = ejecutarNode(["--test"], join(dirEjemplosN1M5, "proyecto"));
    expect(completo.status, completo.stdout).toBe(0);
    expect(completo.stdout).toContain("tests 6");
    expect(completo.stdout).toContain("pass 6");
    expect(completo.stdout).toContain("fail 0");
  });

  it("l02: el runner sobre una copia con prueba borrada sale con 1 y nombra el archivo", () => {
    const carpeta = carpetaTemporal();
    cpSync(join(dirEjemplosN1M5, "proyecto"), join(carpeta, "proyecto"), { recursive: true });
    copyFileSync(join(dirEjemplosN1M5, "reglas.js"), join(carpeta, "reglas.js"));
    copyFileSync(join(dirEjemplosN1M5, "comprobar.js"), join(carpeta, "comprobar.js"));
    rmSync(join(carpeta, "proyecto", "test", "total.test.js"));

    const rojo = spawnSync(process.execPath, ["comprobar.js"], {
      cwd: carpeta,
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("✗ r1: src/total.js sin test/total.test.js");
    expect(rojo.stdout).toContain("1 de 4 reglas en rojo — el runner no permite el commit");
  });

  it("l05: ids duplicados en reglas.json son deriva declarada por el validador", () => {
    const carpeta = carpetaTemporal();
    cpSync(join(dirEjemplosN1M5, "proyecto"), join(carpeta, "proyecto"), { recursive: true });
    copyFileSync(join(dirEjemplosN1M5, "reglas.js"), join(carpeta, "reglas.js"));
    copyFileSync(join(dirEjemplosN1M5, "validar-reglas.js"), join(carpeta, "validar-reglas.js"));
    const rutaReglas = join(carpeta, "proyecto", "reglas.json");
    writeFileSync(
      rutaReglas,
      readFileSync(rutaReglas, "utf8").replace(
        '{ "id": "r2", "descripcion": "toda prueba importa node:test y node:assert/strict" },',
        '{ "id": "r1", "descripcion": "regla duplicada por error" },',
      ),
    );

    const rojo = spawnSync(process.execPath, ["validar-reglas.js"], {
      cwd: carpeta,
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(rojo.status).toBe(1);
    expect(rojo.stdout).toContain("ids duplicados en reglas.json: r1, r1, r3, r4");
  });

  it.skipIf(!gitDisponible)(
    "l04: el hook instalado bloquea la infracción y deja pasar el arreglo (ejercicio real)",
    () => {
      const repo = carpetaTemporal();
      cpSync(join(dirEjemplosN1M5, "proyecto"), join(repo, "proyecto"), { recursive: true });
      for (const fichero of ["reglas.js", "comprobar.js"]) {
        copyFileSync(join(dirEjemplosN1M5, fichero), join(repo, fichero));
      }
      spawnSync("git", ["init", "-q", "-b", "main"], { cwd: repo });
      spawnSync("git", ["config", "user.name", "Test n1/m5"], { cwd: repo });
      spawnSync("git", ["config", "user.email", "test@example.invalid"], { cwd: repo });
      spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `import { instalarHook } from "./reglas.js"; instalarHook(process.cwd());`,
        ],
        {
          cwd: repo,
          encoding: "utf8",
          timeout: 30_000,
        },
      );
      spawnSync("git", ["add", "."], { cwd: repo });
      writeFileSync(
        join(repo, "proyecto", "src", "informe.js"),
        'export function informe() {\n  return "sin prueba";\n}\n',
      );
      spawnSync("git", ["add", "."], { cwd: repo });

      const bloqueado = spawnSync("git", ["commit", "-m", "añade informe sin prueba"], {
        cwd: repo,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(bloqueado.status).toBe(1);
      expect(`${bloqueado.stdout}${bloqueado.stderr}`).toContain("1 de 4 reglas en rojo");

      writeFileSync(
        join(repo, "proyecto", "test", "informe.test.js"),
        'import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport { informe } from "../src/informe.js";\n\ntest("informe devuelve sin prueba", () => {\n  assert.equal(informe(), "sin prueba");\n});\n',
      );
      spawnSync("git", ["add", "."], { cwd: repo });
      const permitido = spawnSync("git", ["commit", "-m", "añade informe con su prueba"], {
        cwd: repo,
        encoding: "utf8",
        timeout: 60_000,
      });
      expect(permitido.status, `${permitido.stdout}${permitido.stderr}`).toBe(0);
      expect(`${permitido.stdout}${permitido.stderr}`).toContain(
        "4 reglas en verde — el runner permite el commit",
      );
    },
    120_000,
  );
});

describe("cobertura de ejemplos", () => {
  /**
   * Ficheros verificables de un módulo: raíz (.js/.sh) y errores/ (.js/.sh),
   * más subcarpetas indicadas (.js) y ficheros de datos adicionales
   * (manifiestos, CSV, README) que se verifican indirectamente.
   */
  function archivosVerificables(
    dir: string,
    subcarpetas: string[] = [],
    adicionales: string[] = [],
  ): string[] {
    const enDisco: string[] = [];
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      if (entrada.isFile() && (entrada.name.endsWith(".js") || entrada.name.endsWith(".sh"))) {
        enDisco.push(entrada.name);
      }
    }
    for (const entrada of readdirSync(join(dir, "errores"), { withFileTypes: true })) {
      if (entrada.isFile() && (entrada.name.endsWith(".js") || entrada.name.endsWith(".sh"))) {
        enDisco.push(`errores/${entrada.name}`);
      }
    }
    for (const subcarpeta of subcarpetas) {
      for (const entrada of readdirSync(join(dir, subcarpeta), { withFileTypes: true })) {
        if (entrada.isFile() && entrada.name.endsWith(".js")) {
          enDisco.push(`${subcarpeta}/${entrada.name}`);
        }
      }
    }
    enDisco.push(...adicionales);
    return enDisco.sort();
  }

  it("m1: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    const enManifiesto = [
      ...casosDirectos.map((caso) => caso.ruta),
      "verificar-estructura.js",
      "saludo-funcion.test.js",
      "celsius-a-fahrenheit.test.js",
      "demo-git.sh",
    ];

    expect(archivosVerificables(dirEjemplos)).toEqual([...enManifiesto].sort());
  });

  it("m2: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    const enManifiesto = [
      ...casosDirectosM2.map((caso) => caso.ruta),
      "normalizar.js",
      "normalizar.test.js",
      "dinero.js",
      "dinero.test.js",
      "dividir.js",
      "dividir.test.js",
      "articulo.js",
      "articulo.test.js",
      "descripcion-articulo.js",
      "descripcion-articulo.test.js",
    ];

    expect(archivosVerificables(dirEjemplosM2)).toEqual([...enManifiesto].sort());
  });

  it("m3: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    const enManifiesto = [
      ...casosDirectosM3.map((caso) => caso.ruta),
      "clasificar.js",
      "clasificar.test.js",
      "acumular.js",
      "acumular.test.js",
      "gastos.js",
      "gastos.test.js",
      "estadisticas.js",
      "estadisticas.test.js",
      "resumen-categorias.js",
      "resumen-categorias.test.js",
      "leer-gastos.js",
      "leer-gastos.test.js",
      "informe.js",
      "informe.test.js",
    ];

    expect(archivosVerificables(dirEjemplosM3)).toEqual([...enManifiesto].sort());
  });

  it("m4: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    const enManifiesto = [
      ...new Set(casosDirectosM4.map((caso) => caso.ruta)),
      "convertir.test.js",
      "revisar-manifiesto.test.js",
      "dependencias.test.js",
      "candidato.test.js",
      "revisar-readme.test.js",
      "proyecto/src/gastos.js",
      "proyecto/src/informe.js",
      "proyecto/test/proyecto.test.js",
      "proyecto/package.json",
      "proyecto/package-lock.json",
      "proyecto/README.md",
      "proyecto/datos/gastos.csv",
    ];

    expect(
      archivosVerificables(
        dirEjemplosM4,
        ["proyecto/src", "proyecto/test"],
        [
          "proyecto/package.json",
          "proyecto/package-lock.json",
          "proyecto/README.md",
          "proyecto/datos/gastos.csv",
        ],
      ),
    ).toEqual([...enManifiesto].sort());
  });

  it("m5: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    const enManifiesto = [
      "repositorio-proyecto.sh",
      "revisar-diff.sh",
      "recuperar-versiones.sh",
      "remoto-local.sh",
      "ramas-feature.sh",
      "revision.sh",
      "flujo-completo.test.js",
      "errores/conflicto-merge.sh",
      "errores/push-rechazado.sh",
    ];

    expect(archivosVerificables(dirEjemplosM5)).toEqual([...enManifiesto].sort());
  });

  it("n1/m1: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    const enManifiesto = [
      "tokenizar.js",
      "alucinacion-api-inexistente.js",
      "ventana-contexto.js",
      "coste-contexto.js",
      "sensibilidad-contexto.js",
      "comprobar-claim.js",
      "comprobar-nota.js",
      "errores/api-inexistente.js",
      "errores/ventana-excedida.js",
      "errores/claim-refutado.js",
      "nota-ejemplo.md",
    ];

    expect(archivosVerificables(dirEjemplosN1M1, [], ["nota-ejemplo.md"])).toEqual(
      [...enManifiesto].sort(),
    );
  });

  it("n1/m2: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    // `serie.js` y las implementaciones de `tareas/` son los entregables bajo
    // prueba: se verifican por importación desde el validador, el medidor y
    // sus suites `.test.js`.
    const enManifiesto = [
      "anatomia.js",
      "contexto-minimo.js",
      "criterios-primero.js",
      "alcance.js",
      "serie.js",
      "comprobar-serie.js",
      "verificacion-rapida.js",
      "errores/tarea-ambigua.js",
      "errores/contexto-inflado.js",
      "errores/alcance-excedido.js",
      "errores/serie-rota.js",
      "tareas/tarea-1.js",
      "tareas/tarea-1-borrador.js",
      "tareas/tarea-1.test.js",
      "tareas/tarea-2.js",
      "tareas/tarea-2.test.js",
      "tareas/tarea-3.js",
      "tareas/tarea-3.test.js",
    ];

    expect(archivosVerificables(dirEjemplosN1M2, ["tareas"])).toEqual([...enManifiesto].sort());
  });

  it("n1/m3: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    // Las entregas del fixture son los objetos revisados: antes/después, la
    // suite de la entrega y `datos.js` (manifiesto y casos límite declarados)
    // se verifican desde las demos de revisión y desde sus propias suites.
    const enManifiesto = [
      "diff.js",
      "pruebas-entrega.js",
      "dependencias.js",
      "casos-limite.js",
      "checklist.js",
      "revisar-entregas.js",
      "errores/despues-roto.js",
      "errores/comprobar-carga.js",
      "errores/revision-cegada.js",
      "errores/dependencia-sobrante.js",
      "errores/caso-limite-silencioso.js",
      "entregas/datos.js",
      "entregas/gastos-antes.js",
      "entregas/gastos-despues.js",
      "entregas/gastos.test.js",
      "entregas/informes-antes.js",
      "entregas/informes-despues.js",
      "entregas/informes.test.js",
      "entregas/fechas-antes.js",
      "entregas/fechas-despues.js",
      "entregas/fechas.test.js",
    ];

    expect(archivosVerificables(dirEjemplosN1M3, ["entregas"])).toEqual([...enManifiesto].sort());
  });

  it("n1/m4: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    // El registro de sesiones, la transcripción de chat y el registro corrupto
    // son los datos que las demos analizan, reejecutan y devuelven: se
    // verifican indirectamente desde cada una de las tres superficies.
    const enManifiesto = [
      "sesiones.js",
      "analizar-chat.js",
      "edicion-inline.js",
      "comandos-permitidos.js",
      "comprobar-registro.js",
      "verificar-sesiones.js",
      "errores/chat-listo-sin-comando.js",
      "errores/parche-roto.js",
      "errores/comando-fuera-de-lista.js",
      "errores/sesion-sin-verificar.js",
      "sesiones/registro.json",
      "sesiones/chat-ejemplo.md",
      "errores/registro-sin-verificar.json",
      "sesiones/proyecto/suma.js",
      "sesiones/proyecto/suma.test.js",
      "sesiones/proyecto/total.js",
      "sesiones/proyecto/total.test.js",
    ];

    expect(
      archivosVerificables(
        dirEjemplosN1M4,
        ["sesiones/proyecto"],
        [
          "sesiones/registro.json",
          "sesiones/chat-ejemplo.md",
          "errores/registro-sin-verificar.json",
        ],
      ),
    ).toEqual([...enManifiesto].sort());
  });

  it("n1/m5: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    // El mini-proyecto `proyecto/` es el objeto de las reglas: sus fuentes y
    // sus pruebas se verifican por la suite `node --test` y por el runner;
    // `reglas.json` es la declaración que leen presentador, runner y validador.
    const enManifiesto = [
      "convenciones.js",
      "comprobar.js",
      "ver-rojos.js",
      "instalar-hook.js",
      "validar-reglas.js",
      "entregable.js",
      "reglas.js",
      "errores/incumplimiento-detectado.js",
      "errores/commit-bloqueado.js",
      "errores/regla-sin-comprobacion.js",
      "errores/comprobacion-sin-regla.js",
      "proyecto/src/saludo.js",
      "proyecto/src/total.js",
      "proyecto/test/saludo.test.js",
      "proyecto/test/total.test.js",
      "proyecto/reglas.json",
    ];

    expect(
      archivosVerificables(
        dirEjemplosN1M5,
        ["proyecto/src", "proyecto/test"],
        ["proyecto/reglas.json"],
      ),
    ).toEqual([...enManifiesto].sort());
  });

  it("m6: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    // `descuento.js` y `presupuesto.js` son las implementaciones bajo prueba:
    // se verifican por importación desde sus suites `.test.js`.
    const enManifiesto = [
      "casos-limite.js",
      "aserciones-intencion.js",
      "descuento.js",
      "descuento.test.js",
      "ciclo-rojo-verde.js",
      "leer-traza.js",
      "reloj-inyectado.js",
      "presupuesto.js",
      "presupuesto.test.js",
      "entregable-rojo-verde.js",
      "errores/asercion-sin-mensaje.js",
      "errores/estado-compartido.js",
      "errores/traza-perdida.js",
    ];

    expect(archivosVerificables(dirEjemplosM6)).toEqual([...enManifiesto].sort());
  });

  it("m7: cada ejemplo del módulo está en el manifiesto de verificación (sin huérfanos)", () => {
    // `web.js` es la implementación compartida (parser, cascada, validador y
    // servidor): se verifica por importación desde cada demo y desde la suite.
    // `pagina/` son las entradas del fixture: HTML, CSS y SVG que la página
    // publicada sirve y que el validador y el servidor comprueban.
    const enManifiesto = [
      "web.js",
      "validar-html.js",
      "arbol-dom.js",
      "especificidad.js",
      "peticion-http.js",
      "servidor-estatico.js",
      "ruta-critica.js",
      "pagina.test.js",
      "entregable-pagina.js",
      "errores/html-invalido.js",
      "errores/css-roto.js",
      "errores/ruta-404.js",
      "pagina/index.html",
      "pagina/estilos.css",
      "pagina/diagrama.svg",
    ];

    expect(
      archivosVerificables(
        dirEjemplosM7,
        [],
        ["pagina/index.html", "pagina/estilos.css", "pagina/diagrama.svg"],
      ),
    ).toEqual([...enManifiesto].sort());
  });
});
