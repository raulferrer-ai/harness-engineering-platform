// ciclo.js — la librería del ciclo AI-native: plan, spec, criterios, suite.
// Cada pieza del ciclo es un fichero del repositorio con forma verificable:
// el plan tiene sus secciones, la spec sus criterios ejecutables (entrada y
// esperado), la implementación su contrato y la suite su verde. Nada se da
// por bueno por leerse bien: se ejecuta y se compara.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";

/** Secciones que todo plan de funcionalidad debe declarar. */
export const SECCIONES_PLAN = ["Objetivo", "Alcance", "Fuera de alcance", "Criterios de entrega"];

/** Valor legible y fiel: JSON.stringify(-Infinity) es «null». */
export function representar(valor) {
  if (typeof valor === "number" && !Number.isFinite(valor)) return String(valor);
  return JSON.stringify(valor);
}

/** Lee el plan y exige sus cuatro secciones. */
export function leerPlan(ruta) {
  const texto = readFileSync(ruta, "utf8");
  const secciones = [...texto.matchAll(/^## (.+)$/gm)].map((captura) => captura[1].trim());
  const faltantes = SECCIONES_PLAN.filter((seccion) => !secciones.includes(seccion));
  if (faltantes.length > 0) {
    throw new Error(`${ruta}: faltan secciones del plan — ${faltantes.join(", ")}`);
  }
  return { secciones: SECCIONES_PLAN };
}

/** Lee la spec y extrae su contrato y sus criterios ejecutables. */
export function leerSpec(ruta) {
  const texto = readFileSync(ruta, "utf8");
  const funcion = /Función: `([A-Za-z_$][\w$]*)/.exec(texto)?.[1];
  if (!funcion) {
    throw new Error(`${ruta}: falta el contrato «Función: nombre»`);
  }
  const criterios = [];
  for (const bloque of texto.split(/^### /m).slice(1)) {
    const cabecera = /^(C\d+)\s·\s(.+)$/m.exec(bloque);
    const lineaEntrada = /^entrada:\s*(.+)$/m.exec(bloque);
    const lineaEsperado = /^esperado:\s*(.+)$/m.exec(bloque);
    if (!cabecera || !lineaEntrada || !lineaEsperado) {
      throw new Error(
        `${ruta}: el criterio debe declarar «entrada» y «esperado» parseables — bloque «${bloque.slice(0, 40)}…»`,
      );
    }
    criterios.push({
      id: cabecera[1],
      titulo: cabecera[2].trim(),
      entrada: JSON.parse(lineaEntrada[1]),
      esperado: JSON.parse(lineaEsperado[1]),
    });
  }
  if (criterios.length === 0) {
    throw new Error(`${ruta}: la spec no declara ningún criterio ejecutable`);
  }
  return { funcion, criterios };
}

/** ¿El esperado pide una excepción concreta? ({"error": "RangeError"}) */
function pideError(esperado) {
  return typeof esperado === "object" && esperado !== null && "error" in esperado;
}

/** Ejecuta cada criterio contra la implementación y compara con su esperado. */
export async function ejecutarCriterios(spec, dirProyecto, fichero = "presupuesto.js") {
  const modulo = await import(
    pathToFileURL(join(dirProyecto, fichero)).href
  );
  const funcion = modulo[spec.funcion];
  if (typeof funcion !== "function") {
    throw new Error(`${fichero} no exporta ${spec.funcion}, la función del contrato`);
  }
  const resultados = [];
  for (const criterio of spec.criterios) {
    let ok;
    let detalle;
    try {
      const obtenido = funcion(...criterio.entrada);
      if (pideError(criterio.esperado)) {
        ok = false;
        detalle = `${criterio.id} esperaba ${criterio.esperado.error}, la función devolvió ${representar(obtenido)}`;
      } else if (isDeepStrictEqual(obtenido, criterio.esperado)) {
        ok = true;
        detalle = `${criterio.id} — ${criterio.titulo}: ${representar(obtenido)}`;
      } else {
        ok = false;
        detalle = `${criterio.id} — ${criterio.titulo}: esperaba ${representar(criterio.esperado)}, devolvió ${representar(obtenido)}`;
      }
    } catch (error) {
      if (pideError(criterio.esperado)) {
        ok = error.constructor.name === criterio.esperado.error;
        detalle = ok
          ? `${criterio.id} lanza ${error.constructor.name} (esperado)`
          : `${criterio.id} lanza ${error.constructor.name}, se esperaba ${criterio.esperado.error}`;
      } else {
        ok = false;
        detalle = `${criterio.id} lanza ${error.constructor.name}: el contrato pedía ${representar(criterio.esperado)}`;
      }
    }
    resultados.push({ id: criterio.id, ok, detalle });
  }
  return resultados;
}

/** Funciones exportadas que la spec no declara (comportamiento inventado). */
export async function funcionesNoDeclaradas(spec, dirProyecto, fichero = "presupuesto.js") {
  const modulo = await import(
    pathToFileURL(join(dirProyecto, fichero)).href
  );
  return Object.keys(modulo).filter((nombre) => nombre !== spec.funcion && !nombre.startsWith("_"));
}

/** Ejecuta la suite del proyecto con el test runner de Node. */
export function ejecutarSuite(dirProyecto) {
  const resultado = spawnSync(process.execPath, ["--test"], {
    cwd: dirProyecto,
    encoding: "utf8",
    timeout: 60_000,
  });
  const pruebas = Number(/^ℹ tests (\d+)$/m.exec(resultado.stdout ?? "")?.[1] ?? 0);
  const fallos = Number(/^ℹ fail (\d+)$/m.exec(resultado.stdout ?? "")?.[1] ?? 0);
  return { status: resultado.status, pruebas, fallos, stdout: resultado.stdout ?? "", stderr: resultado.stderr ?? "" };
}

/** Certificación del ciclo completo: plan, spec, criterios, contrato y suite. */
export async function certificar(dirProyecto) {
  const condiciones = [];
  const incidencias = [];

  leerPlan(join(dirProyecto, "PLAN.md"));
  condiciones.push(`plan: ${SECCIONES_PLAN.length} secciones declaradas`);

  const spec = leerSpec(join(dirProyecto, "spec.md"));
  condiciones.push(`spec: ${spec.criterios.length} criterios ejecutables (contrato ${spec.funcion})`);

  const resultados = await ejecutarCriterios(spec, dirProyecto);
  const incumplidos = resultados.filter((resultado) => !resultado.ok);
  if (incumplidos.length === 0) {
    condiciones.push(`criterios: ${resultados.length} de ${resultados.length} cumplidos`);
  } else {
    for (const incumplido of incumplidos) incidencias.push(`criterio sin cumplir — ${incumplido.detalle}`);
  }

  const sobrantes = await funcionesNoDeclaradas(spec, dirProyecto);
  if (sobrantes.length === 0) {
    condiciones.push("contrato: ninguna función exportada fuera de la spec");
  } else {
    incidencias.push(`funciones no declaradas en la spec: ${sobrantes.join(", ")}`);
  }

  const suite = ejecutarSuite(dirProyecto);
  if (suite.status === 0) {
    condiciones.push(`suite: ${suite.pruebas} pruebas en verde`);
  } else {
    incidencias.push(`suite: ${suite.fallos} pruebas en rojo (node --test terminó con ${suite.status})`);
  }

  return { condiciones, incidencias };
}
