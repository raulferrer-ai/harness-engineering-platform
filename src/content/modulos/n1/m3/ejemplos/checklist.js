// H15 (l05) — el checklist ejecutable: cuatro criterios, un veredicto.
// Diffs, pruebas, dependencias y casos límite, en ese orden, con salida ACEPTAR
// o DEVOLVER y el detalle de cada incidencia.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { cargarModulo, diff, estadisticas } from "./diff.js";
import { ejecutarSuite } from "./pruebas-entrega.js";
import { codigoImporta, dependenciasNuevas } from "./dependencias.js";
import { probarEntrega } from "./casos-limite.js";
import { entregas } from "./entregas/datos.js";

/** Regla del curso: el diff de una tarea se lee entero; 50 líneas es el tope. */
export const LIMITE_DIFF = 50;

export async function revisarEntrega(entrega) {
  const criterios = [];

  // Criterio 1 — el diff: el código cargable y el cambio legible de punta a punta.
  const antes = readFileSync(new URL(`./entregas/${entrega.id}-antes.js`, import.meta.url), "utf8");
  const despues = readFileSync(
    new URL(`./entregas/${entrega.id}-despues.js`, import.meta.url),
    "utf8",
  );
  const carga = await cargarModulo(
    new URL(`./entregas/${entrega.id}-despues.js`, import.meta.url).href,
  );
  if (!carga.ok) {
    criterios.push({
      nombre: "diff",
      ok: false,
      detalle: `código que no carga: ${carga.error.name}: ${carga.error.message}`,
    });
  } else {
    const est = estadisticas(diff(antes, despues));
    const cambiadas = est.anadidas + est.quitadas;
    criterios.push({
      nombre: "diff",
      ok: cambiadas <= LIMITE_DIFF,
      detalle:
        cambiadas <= LIMITE_DIFF
          ? `el código carga y el cambio es legible (${cambiadas} líneas cambiadas)`
          : `diff de ${cambiadas} líneas cambiadas (el curso lee diffs de hasta ${LIMITE_DIFF})`,
    });
  }

  // Criterio 2 — las pruebas de la entrega: ejecutadas, no leídas.
  const suite = ejecutarSuite(`entregas/${entrega.id}.test.js`);
  const verde = suite.fail === 0 && suite.status === 0;
  criterios.push({
    nombre: "pruebas",
    ok: verde,
    detalle: verde
      ? `pass ${suite.pass} · fail ${suite.fail}`
      : `suite en rojo: ${suite.fail} prueba(s) fallan de ${suite.pass + suite.fail}`,
  });

  // Criterio 3 — dependencias: toda nueva debe usarse en el código entregado.
  const nuevas = dependenciasNuevas(entrega);
  const sobrantes = nuevas.filter((d) => !codigoImporta(entrega.id, d));
  criterios.push({
    nombre: "dependencias",
    ok: sobrantes.length === 0,
    detalle:
      nuevas.length === 0
        ? "sin dependencias nuevas"
        : sobrantes.length === 0
          ? `dependencias nuevas usadas: ${nuevas.join(", ")}`
          : `dependencia(s) declarada(s) sin usarse: ${sobrantes.join(", ")}`,
  });

  // Criterio 4 — los casos límite que la tarea exigía.
  const resultados = await probarEntrega(entrega);
  const fallidos = resultados.filter((r) => !r.ok);
  criterios.push({
    nombre: "casos límite",
    ok: fallidos.length === 0,
    detalle:
      fallidos.length === 0
        ? `${resultados.length} de ${resultados.length} en verde`
        : fallidos
            .map(
              (r) =>
                `caso ${JSON.stringify(r.caso.llamada)} → ${r.error.name}: ${r.error.message}`,
            )
            .join("; "),
  });

  const incidencias = criterios.filter((c) => !c.ok);
  return { criterios, incidencias, veredicto: incidencias.length === 0 ? "ACEPTAR" : "DEVOLVER" };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const id = process.argv[2] ?? "gastos";
  const entrega = entregas.find((e) => e.id === id);
  if (!entrega) {
    console.error(
      `no existe la entrega «${id}» (disponibles: ${entregas.map((e) => e.id).join(", ")})`,
    );
    process.exit(1);
  }

  const { criterios, incidencias, veredicto } = await revisarEntrega(entrega);
  console.log(`revisando: ${entrega.id} — ${entrega.titulo}`);
  for (const criterio of criterios) {
    const marca = criterio.ok ? "✓" : "✗";
    console.log(`${marca} criterio (${criterio.nombre}): ${criterio.detalle}`);
  }
  if (veredicto === "ACEPTAR") {
    console.log("veredicto: ACEPTAR (0 incidencias)");
  } else {
    console.log(`veredicto: ${veredicto} (${incidencias.length} incidencia(s))`);
  }
}
