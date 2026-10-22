// H16 (l04) — el asistente de terminal propone comandos; tu lista permitida
// decide cuáles se ejecutan. Nadie corre lo que no está en la lista.
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const dirProyecto = fileURLToPath(new URL("./sesiones/proyecto/", import.meta.url));

export const LISTA_PERMITIDA = [
  { patron: /^node --test( |$)/, descripcion: "suite de pruebas con node:test" },
  { patron: /^node --version$/, descripcion: "versión del runtime" },
  { patron: /^ls( |$)/, descripcion: "listado de archivos" },
];

export function permitido(comando) {
  return LISTA_PERMITIDA.some((entrada) => entrada.patron.test(comando));
}

export function ejecutar(comando) {
  const resultado = spawnSync("sh", ["-c", comando], {
    cwd: dirProyecto,
    encoding: "utf8",
    timeout: 60_000,
  });
  return { codigo: resultado.status, salida: resultado.stdout ?? "" };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const propuestas = [
    "node --test suma.test.js",
    "node --version",
    "ls",
    "git push --force origin main",
    "rm -rf /",
  ];
  console.log(`propuestas del asistente de terminal: ${propuestas.length}`);
  let ejecutados = 0;
  let rechazados = 0;
  for (const comando of propuestas) {
    if (!permitido(comando)) {
      console.log(`✗ rechazado (fuera de la lista permitida): ${comando}`);
      rechazados++;
      continue;
    }
    const { codigo, salida } = ejecutar(comando);
    const pruebas = /ℹ pass (\d+)[\s\S]*?ℹ fail (\d+)/.exec(salida);
    const detalle = pruebas ? ` (pass ${pruebas[1]} · fail ${pruebas[2]})` : "";
    console.log(`✓ ${comando} → código ${codigo}${detalle}`);
    ejecutados++;
  }
  console.log(
    `ejecutados: ${ejecutados} · rechazados: ${rechazados} — la lista permitida decide, no el asistente`,
  );
}
