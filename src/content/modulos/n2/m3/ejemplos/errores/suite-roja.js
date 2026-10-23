// Rojo de l03: violar el protocolo. Se intenta refactorizar con la suite en
// rojo y el protocolo debe abortar antes de tocar una línea.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { correrSuite } from "../refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const taller = mkdtempSync(join(tmpdir(), "hep-m3-"));
cpSync(join(aqui, "..", "fixture"), join(taller, "fixture"), { recursive: true });

const test = join(taller, "fixture", "test", "envios.test.js");
// Un «arreglo rápido» de alguien: cambia la expectativa en vez del código.
writeFileSync(test, readFileSync(test, "utf8").replace("), 3.5);", "), 3.4);"));

const corrida = correrSuite(join(taller, "fixture", "test"));
console.log(`suite en arranque: ${corrida.verdes}/${corrida.pruebas} verdes, ${corrida.fallos} fallo`);
console.log(`✗ no se refactoriza con la suite en rojo: ${corrida.fallos} fallo de ${corrida.pruebas} — cierra el rojo antes de tocar nada`);

rmSync(taller, { recursive: true, force: true });
process.exitCode = 1;
