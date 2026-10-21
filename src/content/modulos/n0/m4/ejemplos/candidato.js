// candidato.js — evaluar una dependencia candidata con criterios fijos (l05)
// El resultado es reproducible: la fecha base se recibe como parámetro, no se
// consulta el reloj de la máquina.
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LICENCIAS_PERMITIDAS = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
]);
const DOS_ANIOS_EN_MS = 2 * 365 * 24 * 60 * 60 * 1000;

export function evaluarCandidato(candidato, hoy) {
  if (typeof candidato !== "object" || candidato === null) {
    throw new TypeError("evaluarCandidato espera un candidato con sus campos");
  }
  const base = Date.parse(hoy);
  const publicado = Date.parse(candidato.ultimaPublicacion);
  if (Number.isNaN(base) || Number.isNaN(publicado)) {
    throw new TypeError("evaluarCandidato necesita fechas ISO (YYYY-MM-DD)");
  }

  const motivos = [];
  let hayDescarte = false;
  let hayRevision = false;

  if (!LICENCIAS_PERMITIDAS.has(candidato.licencia)) {
    motivos.push(`licencia no permitida: ${candidato.licencia ?? "sin declarar"}`);
    hayDescarte = true;
  }
  if (!candidato.tienePruebas) {
    motivos.push("no declara pruebas en su manifiesto");
    hayRevision = true;
  }
  if (base - publicado > DOS_ANIOS_EN_MS) {
    motivos.push(`sin publicar desde hace más de dos años (última: ${candidato.ultimaPublicacion})`);
    hayRevision = true;
  }

  const veredicto = hayDescarte ? "descartar" : hayRevision ? "revisar" : "aceptar";
  return { veredicto, motivos };
}

function ejecutadoDirectamente() {
  const script = process.argv[1];
  return (
    script !== undefined &&
    realpathSync(script) === realpathSync(fileURLToPath(import.meta.url))
  );
}

if (ejecutadoDirectamente()) {
  const candidato = {
    nombre: "paquete-de-ejemplo",
    licencia: "MIT",
    tienePruebas: true,
    ultimaPublicacion: "2026-08-01",
  };
  const { veredicto, motivos } = evaluarCandidato(candidato, "2026-10-21");
  console.log(`candidato: ${candidato.nombre}`);
  console.log(`veredicto: ${veredicto}`);
  for (const motivo of motivos) console.log(`- ${motivo}`);
}
