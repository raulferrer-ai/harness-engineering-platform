// tdd.js — la librería de pruebas primero: rojo genuino, cobertura
// rojos→verdes y alcance cerrado. El test se escribe antes que el código;
// estas funciones juzgan que así fue y que nadie se saltó el rojo. Sólo
// librería estándar, sin red: todo se decide ejecutando `node --test`.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

/** Ejecuta la suite del directorio con el test runner de Node. */
export function ejecutarSuite(dirFeature) {
  const resultado = spawnSync(process.execPath, ["--test"], {
    cwd: dirFeature,
    encoding: "utf8",
    timeout: 60_000,
  });
  const stdout = resultado.stdout ?? "";
  const stderr = resultado.stderr ?? "";
  return {
    status: resultado.status,
    pruebas: Number(/^ℹ tests (\d+)$/m.exec(stdout)?.[1] ?? 0),
    pass: Number(/^ℹ pass (\d+)$/m.exec(stdout)?.[1] ?? 0),
    fallos: Number(/^ℹ fail (\d+)$/m.exec(stdout)?.[1] ?? 0),
    stdout,
    stderr,
    texto: `${stdout}\n${stderr}`,
  };
}

/** Firma de un fallo de carga: la suite murió antes de ejecutar ninguna prueba. */
const FALLOS_DE_CARGA =
  /ERR_MODULE_NOT_FOUND|Cannot find module|SyntaxError|does not provide an export named/;

/** ¿El rojo es de comportamiento (genuino) o de carga (falso)? */
export function clasificar(resultado) {
  if (resultado.status === 0) {
    return { veredicto: "verde", detalle: `${resultado.pruebas} pruebas en verde` };
  }
  if (FALLOS_DE_CARGA.test(resultado.texto)) {
    const firma = resultado.texto
      .split("\n")
      .find((linea) => FALLOS_DE_CARGA.test(linea));
    return {
      veredicto: "rojo falso",
      detalle: `la suite no llegó a ejecutarse — ${(firma ?? "fallo de carga").trim()}`,
    };
  }
  return {
    veredicto: "rojo genuino",
    detalle: `${resultado.pruebas} pruebas ejecutadas, ${resultado.fallos} en rojo por comportamiento`,
  };
}

/** Títulos de las pruebas declaradas en el fichero de tests. */
export function titulosDeTests(rutaTests) {
  const texto = readFileSync(rutaTests, "utf8");
  return [...texto.matchAll(/\b(?:it|test)\(\s*"([^"]+)"/g)].map((captura) => captura[1]);
}

/** Lee el registro TDD: cada ciclo declara qué prueba, con qué rojo y con qué verde. */
export function leerRegistro(ruta) {
  const registro = JSON.parse(readFileSync(ruta, "utf8"));
  if (!Array.isArray(registro.ciclos) || registro.ciclos.length === 0) {
    throw new Error(`${ruta}: el registro declara al menos un ciclo rojo→verde`);
  }
  for (const ciclo of registro.ciclos) {
    if (!ciclo.prueba) {
      throw new Error(`${ruta}: cada ciclo necesita el nombre de su prueba`);
    }
  }
  return { feature: registro.feature, ciclos: registro.ciclos };
}

/** Cada prueba del suite con su ciclo cerrado (rojo y verde) en el registro. */
export function cobertura(registro, rutaTests) {
  const titulos = titulosDeTests(rutaTests);
  const porTitulo = new Map(registro.ciclos.map((ciclo) => [ciclo.prueba, ciclo]));
  const conCiclo = (titulo) => {
    const ciclo = porTitulo.get(titulo);
    return Boolean(ciclo?.rojo && ciclo?.verde);
  };
  return {
    total: titulos.length,
    cubiertas: titulos.filter(conCiclo).length,
    sinCiclo: titulos.filter((titulo) => !porTitulo.has(titulo)),
    sinCerrar: titulos.filter((titulo) => porTitulo.has(titulo) && !conCiclo(titulo)),
    fueraDelSuite: [...porTitulo.keys()].filter((titulo) => !titulos.includes(titulo)),
  };
}

/** Exportaciones de la implementación y cuántas tocan el fichero de tests. */
export function alcance(rutaImpl, rutaTests) {
  const impl = readFileSync(rutaImpl, "utf8");
  const tests = readFileSync(rutaTests, "utf8");
  const exportadas = [...impl.matchAll(/export (?:function|const|class|let) (\w+)/g)].map(
    (captura) => captura[1],
  );
  const probadas = exportadas.filter((nombre) => new RegExp(`\\b${nombre}\\b`).test(tests));
  return { exportadas, probadas, sobrantes: exportadas.filter((n) => !probadas.includes(n)) };
}

/**
 * Certificación del entregable: suite en verde, cobertura rojos→verdes
 * completa y ninguna exportación fuera del alcance de los tests.
 */
export function certificar(dirFeature) {
  const condiciones = [];
  const incidencias = [];
  const rutaTests = join(dirFeature, "test", "contrasena.test.js");
  const rutaImpl = join(dirFeature, "contrasena.js");

  const suite = ejecutarSuite(dirFeature);
  if (suite.status === 0) {
    condiciones.push(`suite: ${suite.pruebas} pruebas en verde`);
  } else {
    incidencias.push(`suite: ${suite.fallos} pruebas en rojo (node --test terminó con ${suite.status})`);
  }

  const registro = leerRegistro(join(dirFeature, "registro.json"));
  const cob = cobertura(registro, rutaTests);
  const completo =
    cob.total > 0 && cob.sinCiclo.length === 0 && cob.sinCerrar.length === 0 && cob.fueraDelSuite.length === 0;
  if (completo) {
    condiciones.push(`cobertura rojos→verdes: ${cob.cubiertas}/${cob.total} pruebas con su ciclo`);
  } else {
    for (const titulo of cob.sinCiclo) incidencias.push(`prueba sin ciclo en el registro: ${titulo}`);
    for (const titulo of cob.sinCerrar) incidencias.push(`prueba sin cerrar rojo y verde: ${titulo}`);
    for (const titulo of cob.fueraDelSuite) {
      incidencias.push(`prueba borrada del suite, su ciclo sigue en el registro: ${titulo}`);
    }
  }

  const al = alcance(rutaImpl, rutaTests);
  if (al.sobrantes.length === 0) {
    condiciones.push(`alcance: ${al.exportadas.length} funciones exportadas, todas probadas`);
  } else {
    incidencias.push(`fuera del alcance de los tests: ${al.sobrantes.join(", ")}`);
  }

  return { condiciones, incidencias };
}
