// dependencias.js — listar las dependencias del proyecto y su lockfile (l04)
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Extrae las dependencias del manifiesto separando las que van en
 * producción (`dependencies`) de las de desarrollo (`devDependencies`).
 */
export function listarDependencias(texto) {
  let manifiesto;
  try {
    manifiesto = JSON.parse(texto);
  } catch {
    throw new TypeError("listarDependencias espera un package.json válido (JSON)");
  }

  const secciones = { produccion: [], desarrollo: [] };
  const campos = [
    ["produccion", "dependencies"],
    ["desarrollo", "devDependencies"],
  ];
  for (const [destino, campo] of campos) {
    const valor = manifiesto[campo];
    if (valor === undefined) continue;
    if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
      throw new TypeError(`«${campo}» debe ser un objeto {nombre: rangoDeVersion}`);
    }
    secciones[destino].push(...Object.keys(valor).sort());
  }
  return secciones;
}

function ejecutadoDirectamente() {
  const script = process.argv[1];
  return (
    script !== undefined && realpathSync(script) === realpathSync(fileURLToPath(import.meta.url))
  );
}

if (ejecutadoDirectamente()) {
  const manifiesto = readFileSync("proyecto/package.json", "utf8");
  const secciones = listarDependencias(manifiesto);
  console.log(`producción: ${secciones.produccion.length} dependencia(s)`);
  console.log(`desarrollo: ${secciones.desarrollo.length} dependencia(s)`);
  console.log(existsSync("proyecto/package-lock.json") ? "lockfile: presente" : "lockfile: falta");
}
