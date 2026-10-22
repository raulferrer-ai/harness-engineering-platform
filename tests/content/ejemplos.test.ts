import {
  copyFileSync,
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
