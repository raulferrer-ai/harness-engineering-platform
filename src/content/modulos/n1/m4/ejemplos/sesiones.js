// H16 (l01) — la anatomía de una sesión registrada.
// Cada sesión tiene 7 campos y una superficie: chat, inline o terminal.
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export const CAMPOS = [
  "id",
  "superficie",
  "objetivo",
  "cambio",
  "comando",
  "codigoSalida",
  "veredicto",
];
export const SUPERFICIES = ["chat", "inline", "terminal"];

export function cargarRegistro(ruta) {
  return JSON.parse(readFileSync(ruta, "utf8"));
}

export function anatomia(registro) {
  const incidencias = [];
  const conteo = { chat: 0, inline: 0, terminal: 0 };
  for (const sesion of registro.sesiones) {
    for (const campo of CAMPOS) {
      if (sesion[campo] === undefined || sesion[campo] === "") {
        incidencias.push(`${sesion.id ?? "?"}: falta el campo «${campo}»`);
      }
    }
    if (!SUPERFICIES.includes(sesion.superficie)) {
      incidencias.push(
        `${sesion.id}: superficie «${sesion.superficie}» fuera de {chat, inline, terminal}`,
      );
    } else {
      conteo[sesion.superficie]++;
    }
  }
  return { total: registro.sesiones.length, conteo, incidencias };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ruta = process.argv[2] ?? fileURLToPath(new URL("./sesiones/registro.json", import.meta.url));
  const registro = cargarRegistro(ruta);
  for (const sesion of registro.sesiones) {
    console.log(
      `${sesion.id} (${sesion.superficie}): ${sesion.objetivo} → ${sesion.comando} → código ${sesion.codigoSalida} — ${sesion.veredicto}`,
    );
  }
  const { total, conteo, incidencias } = anatomia(registro);
  if (incidencias.length > 0) {
    console.error(`anatomía rota: ${incidencias.length} incidencia(s): ${incidencias.join(" | ")}`);
    process.exit(1);
  }
  console.log(
    `anatomía correcta: ${total} sesiones con sus ${CAMPOS.length} campos · superficies: chat ${conteo.chat}, inline ${conteo.inline}, terminal ${conteo.terminal}`,
  );
}
