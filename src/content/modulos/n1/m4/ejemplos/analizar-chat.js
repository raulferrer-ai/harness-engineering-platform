// H16 (l02) — la sesión de chat se analiza como texto: objetivo, contexto
// mínimo, comando ejecutado y código de salida. «Listo» no es verificación.
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export function analizarChat(texto) {
  const incidencias = [];

  const objetivo = /^objetivo:\s*(.+)$/m.exec(texto);
  if (!objetivo) incidencias.push("sin línea «objetivo:» que abra la sesión");

  const contexto = /^contexto:\s*(.+)$/m.exec(texto);
  if (!contexto) {
    incidencias.push("sin línea «contexto:» con lo mínimo necesario");
  } else {
    const palabras = contexto[1].trim().split(/\s+/).length;
    if (palabras > 12) {
      incidencias.push(`contexto inflado: ${palabras} palabras (el curso exige hasta 12)`);
    }
  }

  const comando = /^\$ (node --test[^\n]*)$/m.exec(texto);
  if (!comando) incidencias.push("sin comando de verificación ejecutado (node --test)");
  if (!/ℹ fail 0/.test(texto)) incidencias.push("la salida registrada no muestra «fail 0»");
  if (!/codigo=0/.test(texto)) incidencias.push("sin «codigo=0» al cierre de la sesión");

  return {
    objetivo: objetivo?.[1] ?? null,
    comando: comando?.[1] ?? null,
    incidencias,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ruta = process.argv[2] ?? fileURLToPath(new URL("./sesiones/chat-ejemplo.md", import.meta.url));
  const texto = readFileSync(ruta, "utf8");
  const { objetivo, comando, incidencias } = analizarChat(texto);
  if (incidencias.length > 0) {
    console.error(
      `chat NO válido: ${incidencias.length} incidencia(s): ${incidencias.join(" | ")}`,
    );
    process.exit(1);
  }
  console.log(`chat válido: objetivo «${objetivo}»`);
  console.log(`verificación ejecutada: ${comando} → «fail 0» y codigo=0`);
}
