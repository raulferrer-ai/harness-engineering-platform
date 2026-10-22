// H15 (l03) — compara las dependencias declaradas antes/después de cada
// entrega y comprueba si el código entregado importa realmente las nuevas.
import { readFileSync } from "node:fs";

import { entregas } from "./entregas/datos.js";

export function dependenciasNuevas(entrega) {
  return entrega.dependenciasDespues.filter(
    (dependencia) => !entrega.dependenciasAntes.includes(dependencia),
  );
}

/** ¿Aparece «paquete» como cadena entre comillas en el código de la entrega? */
export function codigoImporta(id, paquete) {
  const codigo = readFileSync(new URL(`./entregas/${id}-despues.js`, import.meta.url), "utf8");
  return new RegExp(`["']${paquete}["']`).test(codigo);
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const entrega of entregas) {
    const nuevas = dependenciasNuevas(entrega);
    if (nuevas.length === 0) {
      console.log(`✓ ${entrega.id}: sin dependencias nuevas`);
      continue;
    }
    for (const dependencia of nuevas) {
      const usado = codigoImporta(entrega.id, dependencia);
      if (usado) {
        console.log(`✓ ${entrega.id}: nueva dependencia «${dependencia}» — el código la usa`);
      } else {
        console.log(
          `✗ ${entrega.id}: nueva dependencia «${dependencia}» — el código NO la importa (sobrante)`,
        );
      }
    }
  }
  console.log(
    "toda dependencia nueva debe justificar su uso en el código que se entrega; lo que no se usa, no se añade",
  );
}
