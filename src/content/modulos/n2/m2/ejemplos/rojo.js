// rojo.js — demo de l01: el primer rojo, antes que el código.
// Contra el esqueleto —la superficie existe, el comportamiento no— la suite
// entera cae por comportamiento. Ese rojo es la instrucción que se le entrega
// al asistente: no se arregla tocando la suite, se arregla implementando.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { clasificar, ejecutarSuite } from "./tdd.js";

const dir = mkdtempSync(join(tmpdir(), "n2m2-rojo-"));
try {
  cpSync("feature", join(dir, "feature"), { recursive: true });
  writeFileSync(
    join(dir, "feature", "contrasena.js"),
    readFileSync(join(dir, "feature", "esqueleto.js"), "utf8"),
  );

  const suite = ejecutarSuite(join(dir, "feature"));
  const veredicto = clasificar(suite);
  console.log(
    `rojo: ${suite.fallos} pruebas en rojo de ${suite.pruebas} — la suite ya dice qué falta antes de escribir el código`,
  );
  console.log(`${veredicto.veredicto}: ${veredicto.detalle}`);

  const correcto =
    veredicto.veredicto === "rojo genuino" &&
    suite.pruebas > 0 &&
    suite.fallos === suite.pruebas;
  if (!correcto) process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
