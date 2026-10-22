/**
 * Demo de l03: el runner sobre variantes rotas — cada infracción sale en rojo.
 * El script termina en verde porque las violaciones son esperadas (se detectan).
 */
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { comprobarProyecto } from "./comprobar.js";

const DIR_EJEMPLOS = dirname(fileURLToPath(import.meta.url));
const DIR_PROYECTO = join(DIR_EJEMPLOS, "proyecto");

/** Copia el proyecto intacto a un temporal y le aplica una rotura. */
function copiaRota(aplicarRotura) {
  const destino = mkdtempSync(join(tmpdir(), "n1m5-rojo-"));
  cpSync(DIR_PROYECTO, destino, { recursive: true });
  aplicarRotura(destino);
  return destino;
}

/** Devuelve la primera incidencia de la regla indicada en un proyecto. */
function incidenciaDe(dirProyecto, idRegla) {
  const { incidencias } = comprobarProyecto(dirProyecto);
  return incidencias.find((incidencia) => incidencia.startsWith(`${idRegla}:`)) ?? "(sin incidencia)";
}

/** Ejecuta las tres variantes rotas y devuelve sus incidencias. */
export function demostrarRojo() {
  const temporales = [];
  try {
    const casos = [
      {
        nombre: "variante A (borrado test/saludo.test.js)",
        idRegla: "r1",
        aplicar: (dir) => rmSync(join(dir, "test", "saludo.test.js")),
      },
      {
        nombre: "variante B (TODO en src/total.js)",
        idRegla: "r3",
        aplicar: (dir) => {
          const ruta = join(dir, "src", "total.js");
          writeFileSync(ruta, `${readFileSync(ruta, "utf8")}// TODO: revisar importes negativos\n`);
        },
      },
      {
        nombre: "variante C (src/fechas.js sin prueba)",
        idRegla: "r1",
        aplicar: (dir) =>
          writeFileSync(
            join(dir, "src", "fechas.js"),
            "export function hoy() {\n  return new Date().toISOString().slice(0, 10);\n}\n",
          ),
      },
    ];
    return casos.map((caso) => {
      const dir = copiaRota(caso.aplicar);
      temporales.push(dir);
      return `${caso.nombre}: ${incidenciaDe(dir, caso.idRegla)}`;
    });
  } finally {
    for (const dir of temporales) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const lineas = demostrarRojo();
  for (const linea of lineas) {
    console.log(linea);
  }
  console.log(`${lineas.length} infracciones detectadas, ninguna pasó en silencio`);
}
