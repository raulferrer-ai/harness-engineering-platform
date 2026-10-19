// Comprobación de enlaces internos del HTML generado (IMPLEMENTATION_PLAN.md
// §6.1 «Enlaces internos» y §10.2, decisión D15: script propio adelantado a H2
// y encadenado en `build:deploy`).
//
// Uso: npm run links   (requiere un `npm run build` previo)
//
// Comprueba que cada href/src interno del HTML de dist/ apunta a un fichero
// existente y que cada ancla (#…) existe en su página de destino.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, posix, relative } from "node:path";
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

const ficherosHtml = listar(dist).filter((f) => f.endsWith(".html"));

// Mapa de ruta URL servible → HTML. "/" es la raíz; "…/index.html" es "…/".
const paginas = new Map();
for (const archivo of ficherosHtml) {
  const rel = relative(dist, archivo).split("\\").join("/");
  const ruta = rel.endsWith("/index.html")
    ? `/${rel.slice(0, -"index.html".length)}`
    : rel === "index.html"
      ? "/"
      : `/${rel}`;
  paginas.set(ruta, readFileSync(archivo, "utf8"));
}

const esExterno = (valor) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(valor);

/**
 * Resuelve la ruta URL de destino de un enlace interno con la lógica de un
 * hosting estático (dist/…/index.html atiende a …/).
 */
function rutaDestino(enlace, rutaPagina) {
  const sinHash = enlace.split("#")[0].split("?")[0];
  if (sinHash === "") return rutaPagina.split("#")[0];
  const esAbsoluta = sinHash.startsWith("/");
  const base = rutaPagina.endsWith("/") ? rutaPagina : posix.dirname(rutaPagina) + "/";
  const normalizada = esAbsoluta ? sinHash : posix.normalize(posix.join(base, sinHash));
  return normalizada.endsWith("/") ? normalizada : `${normalizada}`;
}

const fallos = [];
let comprobados = 0;
let externos = 0;

for (const archivo of ficherosHtml) {
  const relHtml = relative(dist, archivo).split("\\").join("/");
  const html = readFileSync(archivo, "utf8");
  const rutaPagina =
    relHtml === "index.html"
      ? "/"
      : relHtml.endsWith("/index.html")
        ? `/${relHtml.slice(0, -"index.html".length)}`
        : `/${relHtml}`;

  for (const coincidencia of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const enlace = coincidencia[1];
    if (enlace === "") continue;
    if (esExterno(enlace)) {
      externos++;
      continue;
    }
    comprobados++;

    const ancla = enlace.split("#")[1];
    const destino = rutaDestino(enlace, rutaPagina);

    // Fichero de destino en dist/.
    const candidatos =
      destino === "/"
        ? [join(dist, "index.html")]
        : destino.endsWith("/")
          ? [join(dist, destino, "index.html")]
          : [join(dist, destino), join(dist, destino, "index.html")];

    if (!candidatos.some((c) => existsSync(c))) {
      fallos.push(`${relHtml}: «${enlace}» → no existe ${destino} en dist/`);
      continue;
    }

    // Anclas: deben existir como id (o name) en la página HTML de destino.
    if (ancla !== undefined && ancla !== "") {
      const paginaDestino =
        destino.endsWith("/") || destino === "/" ? (destino === "/" ? "/" : destino) : null;
      let texto = null;
      if (paginaDestino !== null && paginas.has(paginaDestino)) {
        texto = paginas.get(paginaDestino);
      } else {
        const htmlDestino = candidatos.find((c) => c.endsWith(".html"));
        if (htmlDestino) texto = readFileSync(htmlDestino, "utf8");
      }
      const marcador = new RegExp(`(?:id|name)="${ancla.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
      if (texto === null || !marcador.test(texto)) {
        fallos.push(`${relHtml}: «${enlace}» → la ancla «#${ancla}» no existe en ${destino}`);
      }
    }
  }
}

if (fallos.length > 0) {
  console.error(`Enlaces internos rotos: ${fallos.length}`);
  for (const fallo of fallos) console.error(`  - ${fallo}`);
  process.exit(1);
}

console.log(
  `Enlaces internos OK: ${comprobados} comprobados en ${ficherosHtml.length} páginas HTML (${externos} externos omitidos).`,
);
