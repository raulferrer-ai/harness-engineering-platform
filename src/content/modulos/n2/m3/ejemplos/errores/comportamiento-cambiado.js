// Rojo de l04: «refactor» que cambia el comportamiento. Se extrae el recargo
// express como en el protocolo, pero con el factor alterado (1.5 → 1.6): las
// métricas mejoran y aun así no es un refactor — lo delata la suite.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { correrSuite, medir } from "../refactor.js";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const taller = mkdtempSync(join(tmpdir(), "hep-m3-"));
cpSync(join(aqui, "..", "fixture"), join(taller, "fixture"), { recursive: true });

const ruta = join(taller, "fixture", "envios.js");
const antes = medir(ruta);

const texto = readFileSync(ruta, "utf8")
  .replace(
    "  if (pedido.express) {\n    total = total * 1.5;\n  }",
    "  total = aplicarExpress(total, pedido.express);",
  )
  .replace(
    "export function costeEnvio(pedido) {",
    "function aplicarExpress(total, express) {\n  return express ? total * 1.6 : total;\n}\n\nexport function costeEnvio(pedido) {",
  );
writeFileSync(ruta, texto);

const corrida = correrSuite(join(taller, "fixture", "test"));
const m = medir(ruta);
console.log(`métricas: función más larga ${antes.funcionMasLarga}→${m.funcionMasLarga}, duplicadas ${antes.lineasDuplicadas}→${m.lineasDuplicadas} — parecería una mejora`);
console.log(`✗ esto no es refactor: la suite pasó de 6/6 verdes a ${corrida.verdes}/${corrida.pruebas} — el recargo ahora multiplica por 1,6 y eso es cambio de comportamiento`);

rmSync(taller, { recursive: true, force: true });
process.exitCode = 1;
