// entregable-pagina.js — l07: la misma suite, dos páginas. Fase roja con
// una página de errores de estructura (código de suite 1) y fase verde con
// la página buena (código de suite 0). El script termina en 0 solo si el
// ciclo rojo→verde se completó como se esperaba.
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const paginaRota = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>   </title>
  </head>
  <body>
    <h1>Entregable con errores</h1>
    <h3>Salto de encabezado</h3>
    <img src="foto.png">
    <p>Sin lang, sin viewport, sin alt y sin landmarks.</p>
  </body>
</html>`;

const suite = fileURLToPath(new URL("./pagina.test.js", import.meta.url));
const carpeta = mkdtempSync(join(tmpdir(), "hep-pagina-"));

function imprimirResumen(salida) {
  for (const linea of salida.split("\n")) {
    if (/^ℹ (tests|suites|pass|fail)/.test(linea)) console.log(linea);
  }
}

try {
  const rota = join(carpeta, "pagina-rota.html");
  writeFileSync(rota, paginaRota);

  const rojo = spawnSync(process.execPath, ["--test", suite], {
    encoding: "utf8",
    timeout: 30_000,
    env: { ...process.env, PAGINA: rota },
  });
  console.log("--- rojo a propósito (página con errores de estructura) ---");
  imprimirResumen(rojo.stdout);
  console.log(`código de salida: ${rojo.status}`);

  const verde = spawnSync(process.execPath, ["--test", suite], {
    encoding: "utf8",
    timeout: 30_000,
  });
  console.log("--- verde (misma suite, página buena) ---");
  imprimirResumen(verde.stdout);
  console.log(`código de salida: ${verde.status}`);

  const valido = rojo.status === 1 && verde.status === 0;
  console.log(
    valido
      ? "entregable válido: la misma suite cae en rojo (1) con la página rota y termina en verde (0) con la buena"
      : `entregable inválido: rojo=${rojo.status} verde=${verde.status}`,
  );
  process.exitCode = valido ? 0 : 1;
} finally {
  rmSync(carpeta, { recursive: true, force: true });
}
