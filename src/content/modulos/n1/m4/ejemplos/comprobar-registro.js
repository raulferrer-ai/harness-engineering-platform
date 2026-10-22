// H16 (l05) — el registro se verifica reejecutando lo que declara:
// campos completos, superficie válida, comando node --test y el código de
// salida declarado tiene que coincidir con el real.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

import { CAMPOS, SUPERFICIES } from "./sesiones.js";

const dirProyecto = fileURLToPath(new URL("./sesiones/proyecto/", import.meta.url));

function resumenRunner(salida) {
  const ultima = (clave) => {
    const coincidencias = [...salida.matchAll(new RegExp(`ℹ ${clave} (\\d+)`, "g"))];
    return Number(coincidencias.at(-1)?.[1] ?? 0);
  };
  return { pass: ultima("pass"), fail: ultima("fail") };
}

export function verificarRegistro(ruta) {
  const registro = JSON.parse(readFileSync(ruta, "utf8"));
  const incidencias = [];
  const detalles = [];

  if (registro.sesiones.length !== 5) {
    incidencias.push(
      `el registro declara ${registro.sesiones.length} sesiones; el entregable exige 5`,
    );
  }

  for (const sesion of registro.sesiones) {
    for (const campo of CAMPOS) {
      if (sesion[campo] === undefined || sesion[campo] === "") {
        incidencias.push(`${sesion.id ?? "?"}: falta el campo «${campo}»`);
      }
    }
    if (!SUPERFICIES.includes(sesion.superficie)) {
      incidencias.push(`${sesion.id}: superficie «${sesion.superficie}» no reconocida`);
      continue;
    }
    if (!sesion.comando?.startsWith("node --test")) {
      incidencias.push(`${sesion.id}: el comando «${sesion.comando}» no es node --test`);
      continue;
    }

    const argumentos = sesion.comando.split(" ").slice(1);
    const resultado = spawnSync(process.execPath, argumentos, {
      cwd: dirProyecto,
      encoding: "utf8",
      timeout: 60_000,
    });
    const { pass, fail } = resumenRunner(resultado.stdout ?? "");
    const codigo = resultado.status;

    if (codigo !== sesion.codigoSalida) {
      incidencias.push(
        `${sesion.id}: el comando devolvió ${codigo}, el registro declara ${sesion.codigoSalida}`,
      );
    }
    if (sesion.veredicto === "verificada" && (codigo !== 0 || sesion.codigoSalida !== 0)) {
      incidencias.push(
        `${sesion.id}: veredicto «verificada» con código de salida ${sesion.codigoSalida}`,
      );
    }
    detalles.push({ ...sesion, codigo, pass, fail });
  }

  return { incidencias, detalles };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ruta = process.argv[2] ?? fileURLToPath(new URL("./sesiones/registro.json", import.meta.url));
  const { incidencias, detalles } = verificarRegistro(ruta);
  for (const detalle of detalles) {
    const ok = incidencias.every((i) => !i.startsWith(`${detalle.id}:`));
    const marca = ok ? "✓" : "✗";
    console.log(
      `${marca} ${detalle.id} (${detalle.superficie}): ${detalle.comando} → código ${detalle.codigo} (pass ${detalle.pass} · fail ${detalle.fail})`,
    );
  }
  if (incidencias.length > 0) {
    console.error(`registro NO válido: ${incidencias.length} incidencia(s)`);
    for (const incidencia of incidencias) console.error(`  - ${incidencia}`);
    process.exit(1);
  }
  const pruebas = detalles.reduce((total, d) => total + d.pass, 0);
  console.log(
    `registro válido: ${detalles.length} sesiones, ${detalles.length} comandos reejecutados, ${pruebas} pruebas en verde`,
  );
}
