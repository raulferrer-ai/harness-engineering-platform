// Rojo de l06: métricas sin suite. La refactorización de referencia mejora
// todas las cifras, pero sin suite que la respalde no hay red de seguridad:
// el certificador se niega a aprobar aunque las métricas sean bonitas.

import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { certificar, medir } from "../refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const taller = mkdtempSync(join(tmpdir(), "hep-m3-"));
cpSync(join(aqui, "..", "fixture"), join(taller, "fixture"), { recursive: true });

const original = join(aqui, "..", "fixture", "envios.js");
const refactorizado = join(taller, "fixture", "envios.js");
const suite = join(taller, "fixture", "test");

// La entrega «sin tests»: la refactorización está, la red de seguridad no.
cpSync(join(aqui, "..", "fixture", "despues.js"), refactorizado);
rmSync(suite, { recursive: true, force: true });

const antes = medir(original);
const c = certificar({ original, refactorizado, suite, metricasAntes: antes });
console.log(`métricas: función más larga ${antes.funcionMasLarga}→${c.despues.funcionMasLarga}, números mágicos ${antes.numerosMagicos}→${c.despues.numerosMagicos} — mejoran todas`);
console.log(`✗ entregable NO válido: ${c.incidencias.length} incidencias — ${c.incidencias[0]} (sin suite no hay refactor certificable)`);

rmSync(taller, { recursive: true, force: true });
process.exitCode = 1;
