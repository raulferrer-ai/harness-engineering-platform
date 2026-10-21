// informe.js — el entregable del módulo: informe de un fichero real (lección l07)
import { maximoImporte } from "./acumular.js";
import { importesDe, mediaImportes, totalImportes, filtrarPorCategoria } from "./estadisticas.js";
import { leerGastos } from "./leer-gastos.js";
import { cuentaPorCategoria } from "./resumen-categorias.js";

export function generarInforme(ruta) {
  const gastos = leerGastos(ruta);
  const importes = importesDe(gastos);
  const cuentas = cuentaPorCategoria(gastos);
  const lineas = [
    "Informe de gastos",
    `gastos: ${gastos.length}`,
    `total: ${totalImportes(importes).toFixed(2)} EUR`,
    `media: ${mediaImportes(importes).toFixed(2)} EUR`,
    `máximo: ${maximoImporte(importes).toFixed(2)} EUR`,
    "por categoría:",
  ];
  for (const categoria of Object.keys(cuentas).sort()) {
    const total = totalImportes(importesDe(filtrarPorCategoria(gastos, categoria)));
    lineas.push(`  ${categoria}: ${cuentas[categoria]} gasto(s), ${total.toFixed(2)} EUR`);
  }
  return lineas.join("\n");
}
