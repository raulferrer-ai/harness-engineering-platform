// Rojo de l06: la API rota. Se refactoriza bien (las métricas mejoran y la
// lógica es la misma), pero se renombra un export: el contrato con quien
// consume el módulo se rompe y el certificador lo delata.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

cpSync(join(aqui, "..", "fixture", "despues.js"), refactorizado);
writeFileSync(
  refactorizado,
  readFileSync(refactorizado, "utf8").replace("export function resumenPedido", "export function resumen"),
);

const antes = medir(original);
const c = certificar({ original, refactorizado, suite, metricasAntes: antes });
console.log(`métricas: función más larga ${antes.funcionMasLarga}→${c.despues.funcionMasLarga}, números mágicos ${antes.numerosMagicos}→${c.despues.numerosMagicos} — mejoran igualmente`);
console.log(`suite: ${c.corrida.verdes}/${c.corrida.pruebas} verdes, ${c.corrida.fallos} fallo — el test que importaba resumenPedido ya no carga`);
console.log(`✗ entregable NO válido: ${c.incidencias.length} incidencias — la API cambió: los exports ya no son los mismos`);

rmSync(taller, { recursive: true, force: true });
process.exitCode = 1;
