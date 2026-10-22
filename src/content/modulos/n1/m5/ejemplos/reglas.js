/**
 * Reglas del repositorio del mini-proyecto n1/m5: implementaciones (COMPROBACIONES)
 * y texto del hook pre-commit. Solo librería estándar.
 */
import { chmodSync, copyFileSync, cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

/** Texto del hook: un fichero ejecutable que llama al runner de las reglas. */
export const HOOK_PRE_COMMIT = `#!/bin/sh
# Pre-commit del módulo n1/m5: el runner de las reglas, antes de crear el commit.
node comprobar.js
`;

/** Lee y valida la declaración de reglas de un proyecto. */
export function leerReglas(rutaReglas) {
  const datos = JSON.parse(readFileSync(rutaReglas, "utf8"));
  if (!Array.isArray(datos.reglas) || datos.reglas.length === 0) {
    throw new Error(`reglas.json sin ninguna regla: ${rutaReglas}`);
  }
  for (const regla of datos.reglas) {
    if (typeof regla.id !== "string" || typeof regla.descripcion !== "string") {
      throw new Error(`regla mal formada (falta id o descripcion): ${JSON.stringify(regla)}`);
    }
  }
  return datos;
}

/** Escribe .git/hooks/pre-commit en un repo y lo deja ejecutable. */
export function instalarHook(dirRepo) {
  const ruta = join(dirRepo, ".git", "hooks", "pre-commit");
  writeFileSync(ruta, HOOK_PRE_COMMIT);
  chmodSync(ruta, 0o755);
  return ruta;
}

/** Concuerda número y sustantivo en los mensajes del runner. */
export function plural(cantidad, singular, varios) {
  return `${cantidad} ${cantidad === 1 ? singular : varios}`;
}

/** Monta el mini-proyecto (proyecto/, reglas.js, comprobar.js) en un repo y le instala el hook. */
export function prepararRepoConReglas(dirDestino, dirOrigen) {
  cpSync(join(dirOrigen, "proyecto"), join(dirDestino, "proyecto"), { recursive: true });
  for (const fichero of ["reglas.js", "comprobar.js"]) {
    copyFileSync(join(dirOrigen, fichero), join(dirDestino, fichero));
  }
  return instalarHook(dirDestino);
}

/** Ejecuta un comando git en un directorio y devuelve salidas y código de salida. */
export function ejecutarGit(dir, ...argumentos) {
  const { stdout, stderr, status } = spawnSync("git", argumentos, { cwd: dir, encoding: "utf8" });
  return { stdout: stdout.trim(), stderr: stderr.trim(), estado: status };
}

function nombresEn(dir, sufijo) {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter((fichero) => fichero.endsWith(sufijo))
    .sort();
}

/**
 * Implementación de cada regla declarada. Recibe la raíz del proyecto y
 * devuelve { ok, detalle }. El runner sólo ejecuta las reglas declaradas.
 */
export const COMPROBACIONES = {
  r1: {
    comprobar(dirProyecto) {
      const fuentes = nombresEn(join(dirProyecto, "src"), ".js");
      const pruebas = nombresEn(join(dirProyecto, "test"), ".test.js").map((fichero) =>
        fichero.replace(/\.test\.js$/, ".js"),
      );
      const problemas = [
        ...fuentes.filter((fichero) => !pruebas.includes(fichero)).map((fichero) => `src/${fichero} sin test/${fichero.replace(/\.js$/, ".test.js")}`),
        ...pruebas.filter((fichero) => !fuentes.includes(fichero)).map((fichero) => `test/${fichero.replace(/\.js$/, ".test.js")} sin src/${fichero}`),
      ];
      return problemas.length === 0
        ? { ok: true, detalle: `${fuentes.length} parejas src↔test` }
        : { ok: false, detalle: problemas.join(" | ") };
    },
  },
  r2: {
    comprobar(dirProyecto) {
      const incompletas = nombresEn(join(dirProyecto, "test"), ".test.js").filter((fichero) => {
        const texto = readFileSync(join(dirProyecto, "test", fichero), "utf8");
        return !texto.includes('from "node:test"') || !texto.includes('from "node:assert/strict"');
      });
      return incompletas.length === 0
        ? { ok: true, detalle: `${plural(nombresEn(join(dirProyecto, "test"), ".test.js").length, "prueba", "pruebas")} con node:test y node:assert/strict` }
        : { ok: false, detalle: incompletas.map((fichero) => `test/${fichero} sin node:test o node:assert/strict`).join(" | ") };
    },
  },
  r3: {
    comprobar(dirProyecto) {
      const conTodo = nombresEn(join(dirProyecto, "src"), ".js").filter((fichero) =>
        readFileSync(join(dirProyecto, "src", fichero), "utf8").includes("TODO"),
      );
      return conTodo.length === 0
        ? { ok: true, detalle: "0 apariciones de TODO en src/" }
        : { ok: false, detalle: conTodo.map((fichero) => `src/${fichero} contiene TODO`).join(" | ") };
    },
  },
  r4: {
    comprobar(dirProyecto) {
      const sinCierre = [
        ...nombresEn(join(dirProyecto, "src"), ".js").map((fichero) => join("src", fichero)),
        ...nombresEn(join(dirProyecto, "test"), ".js").map((fichero) => join("test", fichero)),
      ].filter((relativo) => !readFileSync(join(dirProyecto, relativo), "utf8").endsWith("\n"));
      return sinCierre.length === 0
        ? { ok: true, detalle: `${nombresEn(join(dirProyecto, "src"), ".js").length + nombresEn(join(dirProyecto, "test"), ".js").length} ficheros cerrados con salto de línea` }
        : { ok: false, detalle: sinCierre.map((fichero) => `${fichero} no termina con salto de línea`).join(" | ") };
    },
  },
};
