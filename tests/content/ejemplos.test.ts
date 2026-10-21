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

describe("cobertura de ejemplos", () => {
  /**
   * Ficheros verificables de un módulo: raíz (.js/.sh) y errores/ (.js),
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
      if (entrada.isFile() && entrada.name.endsWith(".js")) {
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
});
