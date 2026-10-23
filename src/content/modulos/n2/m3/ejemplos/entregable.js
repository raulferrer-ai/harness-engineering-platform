// l06 · Demo: el certificador del entregable. Sobre la refactorización de
// referencia se exigen las tres condiciones a la vez: suite verde, API
// intacta y métricas de olor mejoradas. Copia el fixture a un temporal.

import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { certificar, medir, mismosExports } from "./refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const taller = mkdtempSync(join(tmpdir(), "hep-m3-"));
cpSync(join(aqui, "fixture"), join(taller, "fixture"), { recursive: true });

const original = join(aqui, "fixture", "envios.js");
const refactorizado = join(taller, "fixture", "envios.js");
const suite = join(taller, "fixture", "test");

// La entrega: la refactorización de referencia ocupa el lugar del original.
cpSync(join(aqui, "fixture", "despues.js"), refactorizado);

const antes = medir(original);
const c = certificar({ original, refactorizado, suite, metricasAntes: antes });

console.log(c.corrida.status === 0 ? ` ✓ suite: ${c.corrida.verdes}/${c.corrida.pruebas} pruebas en verde` : ` ✗ suite: ${c.corrida.fallos} fallos`);
console.log(mismosExports(original, refactorizado) ? " ✓ API intacta: mismos exports (costeEnvio, resumenPedido)" : " ✗ API cambiada");
console.log(c.veredicto.mejora ? ` ✓ métricas: ${c.veredicto.mejoran.join(", ")} bajan — ninguna sube` : ` ✗ métricas: ${c.veredicto.empeoran.join(", ")} suben`);
console.log(
  c.valido
    ? `refactor sin regresiones certificado: 3/3 condiciones — función más larga ${antes.funcionMasLarga}→${c.despues.funcionMasLarga}, números mágicos ${antes.numerosMagicos}→${c.despues.numerosMagicos}`
    : `entregable NO válido: ${c.incidencias.length} incidencias`,
);

rmSync(taller, { recursive: true, force: true });
process.exitCode = c.valido ? 0 : 1;
