// Comprobación del índice de Pagefind (IMPLEMENTATION_PLAN.md §6.1 y H4).
//
// Uso: npm run pagefind:check   (requiere `npm run build`, que genera el
// índice con `npm run pagefind` tras compilar)
//
// Comprueba que:
//  1. el índice y su runtime existen en dist/pagefind/;
//  2. el índice no está vacío (page_count por idioma > 0);
//  3. el número de páginas indexadas coincide EXACTAMENTE con los ficheros
//     HTML que marcan data-pagefind-body (así, una página nueva con marcado
//     correcto queda incluida y una sin marcado queda excluida);
//  4. la página 404 no se indexa.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, URL as NodeURL } from "node:url";

const dist = fileURLToPath(new NodeURL("../../dist/", import.meta.url));

if (!existsSync(dist)) {
  console.error("No existe dist/: ejecuta primero `npm run build`.");
  process.exit(1);
}

function listar(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(dir, entrada.name);
    return entrada.isDirectory() ? listar(ruta) : [ruta];
  });
}

const fallos = [];

// 1. Existencia del índice y del runtime.
const entradaRuta = join(dist, "pagefind", "pagefind-entry.json");
const runtimeRuta = join(dist, "pagefind", "pagefind.js");
if (!existsSync(entradaRuta)) {
  console.error("No existe dist/pagefind/pagefind-entry.json: ejecuta `npm run pagefind`.");
  process.exit(1);
}
if (!existsSync(runtimeRuta)) {
  fallos.push("Falta dist/pagefind/pagefind.js (runtime de búsqueda).");
}

// 2. page_count total del índice.
let entrada;
try {
  entrada = JSON.parse(readFileSync(entradaRuta, "utf8"));
} catch {
  console.error("pagefind-entry.json no es JSON válido.");
  process.exit(1);
}
const paginasIndexadas = Object.values(entrada.languages ?? {}).reduce(
  (suma, idioma) => suma + (idioma.page_count ?? 0),
  0,
);
if (paginasIndexadas === 0) {
  fallos.push("El índice no contiene ninguna página.");
}

// 3. Ficheros HTML con marcado de cuerpo.
const ficherosHtml = listar(dist).filter((f) => f.endsWith(".html"));
const conCuerpo = ficherosHtml.filter((f) =>
  readFileSync(f, "utf8").includes("data-pagefind-body"),
);
if (conCuerpo.length !== paginasIndexadas) {
  fallos.push(
    `El índice tiene ${paginasIndexadas} páginas pero ${conCuerpo.length} ficheros HTML ` +
      "marcan data-pagefind-body (¿índice desactualizado? vuelve a ejecutar `npm run pagefind`).",
  );
}

// 4. La 404 nunca se indexa.
const cuatroCuatro = join(dist, "404.html");
if (existsSync(cuatroCuatro) && readFileSync(cuatroCuatro, "utf8").includes("data-pagefind-body")) {
  fallos.push("La página 404 no debe llevar data-pagefind-body: quedaría indexada.");
}

if (fallos.length > 0) {
  console.error(`Problemas en el índice de Pagefind: ${fallos.length}`);
  for (const fallo of fallos) console.error(`  - ${fallo}`);
  process.exit(1);
}

const idiomas = Object.keys(entrada.languages ?? {}).join(", ") || "—";
const rel = (ruta) => relative(dist, ruta);
console.log(
  `Pagefind OK: ${paginasIndexadas} páginas indexadas (idioma: ${idiomas}) = ` +
    `${conCuerpo.length} ficheros con data-pagefind-body de ${ficherosHtml.length} HTML; ` +
    "404 excluida.",
);
console.log(`  (índice en ${rel(entradaRuta)})`);
