// web.js — implementación del módulo n0/m7 con solo librería estándar.
// Analiza HTML en un árbol, analiza CSS y resuelve la cascada, valida una
// página con diez comprobaciones y sirve archivos estáticos con MIME y
// protección de rutas. Es didáctica, no un navegador: el matcher de
// selectores admite tipo, .clase, #id y combinador descendiente (espacio).

import { readFileSync, statSync } from "node:fs";
import { createServer, request } from "node:http";
import { extname, join, resolve, sep } from "node:path";

// ---------------------------------------------------------------------------
// 1. HTML → árbol (DOM)
// ---------------------------------------------------------------------------

const ELEMENTOS_VACIOS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

function parsearAtributos(texto) {
  const atributos = {};
  const patron = /([a-zA-Z][\w-]*)(?:\s*=\s*"([^"]*)"|([^\s"=]+))?/g;
  for (const coincidencia of texto.matchAll(patron)) {
    atributos[coincidencia[1].toLowerCase()] = coincidencia[2] ?? coincidencia[3] ?? "";
  }
  return atributos;
}

/**
 * Convierte HTML en un árbol: { tipo: "raiz"|"elemento"|"texto", ... }.
 * Lanza `Error` si hay un cierre desbalanceado o una etiqueta sin cerrar.
 */
export function parsearHtml(html) {
  const raiz = { tipo: "raiz", hijos: [] };
  const pila = [raiz];
  const patron =
    /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/gi;

  for (const coincidencia of html.matchAll(patron)) {
    const token = coincidencia[0];
    if (token.startsWith("<!--") || /^<!DOCTYPE/i.test(token)) continue;

    if (coincidencia[1] !== undefined) {
      // Etiqueta de cierre
      const actual = pila[pila.length - 1];
      const etiqueta = coincidencia[1].toLowerCase();
      if (actual === raiz || actual.etiqueta !== etiqueta) {
        throw new Error(`cierre desbalanceado: </${coincidencia[1]}>`);
      }
      pila.pop();
      continue;
    }

    if (coincidencia[2] !== undefined) {
      // Etiqueta de apertura
      const etiqueta = coincidencia[2].toLowerCase();
      const resto = coincidencia[3];
      const autoCierre = /\/\s*$/.test(resto);
      const nodo = {
        tipo: "elemento",
        etiqueta,
        atributos: parsearAtributos(resto.replace(/\/\s*$/, "")),
        hijos: [],
      };
      pila[pila.length - 1].hijos.push(nodo);
      if (!autoCierre && !ELEMENTOS_VACIOS.has(etiqueta)) pila.push(nodo);
      continue;
    }

    if (coincidencia[4] !== undefined) {
      const texto = coincidencia[4].replace(/\s+/g, " ").trim();
      if (texto) pila[pila.length - 1].hijos.push({ tipo: "texto", contenido: texto });
    }
  }

  if (pila.length > 1) {
    throw new Error(`etiqueta sin cerrar: <${pila[pila.length - 1].etiqueta}>`);
  }
  return raiz;
}

/** Devuelve el árbol como líneas indentadas para imprimirlo en consola. */
export function lineasDelArbol(nodo, prefijo = "", salida = []) {
  if (nodo.tipo === "raiz") {
    salida.push("(raíz)");
    for (const hijo of nodo.hijos) lineasDelArbol(hijo, "  ", salida);
    return salida;
  }
  if (nodo.tipo === "texto") {
    salida.push(`${prefijo}"${nodo.contenido}"`);
    return salida;
  }
  const id = nodo.atributos.id ? `#${nodo.atributos.id}` : "";
  const clases = nodo.atributos.class
    ? `.${nodo.atributos.class.split(/\s+/).join(".")}`
    : "";
  salida.push(`${prefijo}${nodo.etiqueta}${id}${clases}`);
  for (const hijo of nodo.hijos) lineasDelArbol(hijo, `${prefijo}  `, salida);
  return salida;
}

// ---------------------------------------------------------------------------
// 2. CSS → reglas, especificidad y cascada
// ---------------------------------------------------------------------------

/** Especificidad de un selector: [ids, clases, elementos]. */
export function especificidad(selector) {
  const s = selector.trim();
  const a = (s.match(/#[\w-]+/g) ?? []).length;
  const b =
    (s.match(/\.[\w-]+/g) ?? []).length +
    (s.match(/\[[^\]]+\]/g) ?? []).length +
    (s.match(/(?<![:\w-])::?[a-z][\w-]*(?:\([^)]*\))?/g) ?? []).length;
  const sinEspeciales = s
    .replace(/#[\w-]+/g, " ")
    .replace(/\.[\w-]+/g, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/(?<![:\w-])::?[a-z][\w-]*(?:\([^)]*\))?/g, " ");
  const c = (sinEspeciales.match(/(^|[\s>+~,])([a-z][\w-]*)/gi) ?? []).length;
  return [a, b, c];
}

function compararEspecificidad(x, y) {
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

function numeroDeLinea(texto, indice) {
  return texto.slice(0, indice).split("\n").length;
}

/**
 * Analiza una hoja de estilos en reglas: { selector, especificidad,
 * declaraciones, orden }. Lanza `Error` con línea si la sintaxis falla
 * (llave desbalanceada o declaración sin «:»).
 */
export function parsearCss(css) {
  const sinComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const reglas = [];
  const patron = /([^{}]+)\{([^{}]*)\}/g;

  for (const coincidencia of sinComentarios.matchAll(patron)) {
    const selector = coincidencia[1].trim().replace(/\s+/g, " ");
    if (!selector) throw new Error("selector vacío");
    const cuerpo = coincidencia[2];
    // La línea de la regla es la de la llave «{», no la del inicio del selector.
    const lineaBase = numeroDeLinea(sinComentarios, (coincidencia.index ?? 0) + coincidencia[1].length);
    const declaraciones = [];
    for (const parteDecrujada of cuerpo.split(";")) {
      const parte = parteDecrujada.trim();
      if (!parte) continue;
      const dosPuntos = parte.indexOf(":");
      if (dosPuntos === -1) {
        const desplazamiento = cuerpo.indexOf(parteDecrujada.trim());
        const linea = lineaBase + (desplazamiento > 0 ? numeroDeLinea(cuerpo, desplazamiento) - 1 : 0);
        throw new Error(`CSS inválido en la línea ${linea}: declaración sin «:» — «${parte}»`);
      }
      declaraciones.push({
        propiedad: parte.slice(0, dosPuntos).trim(),
        valor: parte.slice(dosPuntos + 1).trim(),
      });
    }
    reglas.push({ selector, especificidad: especificidad(selector), declaraciones, orden: reglas.length });
  }

  const restante = sinComentarios.replace(patron, "").trim();
  if (/[{}]/.test(restante)) {
    const linea = numeroDeLinea(sinComentarios, restante.length > 0 ? 0 : 0);
    throw new Error(`CSS inválido: llave sin equilibrar cerca de la línea ${linea}`);
  }
  return reglas;
}

/** ¿El elemento (con su camino desde la raíz) casa el selector descendiente? */
export function combina(selector, camino) {
  const partes = selector.split(/\s+/).filter(Boolean);
  let posicion = camino.length - 1;
  for (let p = partes.length - 1; p >= 0; p--) {
    if (posicion < 0 || !matcheaSimple(partes[p], camino[posicion])) return false;
    if (p > 0) {
      let ancestro = posicion - 1;
      while (ancestro >= 0 && !matcheaSimple(partes[p - 1], camino[ancestro])) ancestro--;
      if (ancestro < 0) return false;
      posicion = ancestro;
    }
  }
  return true;
}

function matcheaSimple(compuesto, elemento) {
  const tokens = compuesto.match(/#[\w-]+|\.[\w-]+|\[[^\]]+\]|^[a-z][\w-]*/gi) ?? [];
  for (const token of tokens) {
    if (token.startsWith("#")) {
      if (elemento.atributos.id !== token.slice(1)) return false;
    } else if (token.startsWith(".")) {
      const clases = (elemento.atributos.class ?? "").split(/\s+/);
      if (!clases.includes(token.slice(1))) return false;
    } else if (token.startsWith("[")) {
      const atributo = token.slice(1, -1).split("=");
      const nombre = atributo[0].trim();
      const valor = (atributo[1] ?? "").trim().replace(/^["']|["']$/g, "");
      const real = elemento.atributos[nombre];
      if (real === undefined || (valor && real !== valor)) return false;
    } else if (elemento.etiqueta !== token.toLowerCase()) {
      return false;
    }
  }
  return tokens.length > 0;
}

// Hoja de estilos por defecto del agente de usuario (la «suya» de todo navegador).
const AGENTE_BLOQUE = new Set([
  "html", "body", "header", "nav", "main", "footer", "article", "section",
  "figure", "figcaption", "div", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6", "p",
]);

function hojaAgente(elemento) {
  if (AGENTE_BLOQUE.has(elemento.etiqueta)) return { display: "block" };
  if (elemento.etiqueta === "li") return { display: "list-item" };
  return { display: "inline" };
}

/**
 * Recorre el árbol y, para cada elemento, resuelve la cascada:
 * hoja del agente → reglas de autor ordenadas por especificidad y orden.
 * Devuelve { elemento, camino, estilos, fuentes } (fuentes indica de qué
 * selector salió cada propiedad final).
 */
export function estilosCalculados(raiz, reglas) {
  const resultado = [];
  const recorrer = (elemento, camino) => {
    const nuevoCamino = [...camino, elemento];
    const estilos = { ...hojaAgente(elemento) };
    const fuentes = { display: "hoja del agente (usuario)" };
    const candidatas = reglas.filter((regla) => combina(regla.selector, nuevoCamino));
    candidatas.sort(
      (x, y) =>
        compararEspecificidad(x.especificidad, y.especificidad) || x.orden - y.orden,
    );
    for (const regla of candidatas) {
      for (const declaracion of regla.declaraciones) {
        estilos[declaracion.propiedad] = declaracion.valor;
        fuentes[declaracion.propiedad] = `${regla.selector} (orden ${regla.orden + 1})`;
      }
    }
    resultado.push({ elemento, camino: nuevoCamino, estilos, fuentes });
    for (const hijo of elemento.hijos) {
      if (hijo.tipo === "elemento") recorrer(hijo, nuevoCamino);
    }
  };
  for (const hijo of raiz.hijos) if (hijo.tipo === "elemento") recorrer(hijo, []);
  return resultado;
}

// ---------------------------------------------------------------------------
// 3. Validador: diez comprobaciones estructurales
// ---------------------------------------------------------------------------

export function validarPagina(html, css = "") {
  const comprobaciones = [];
  const anadir = (nombre, ok, detalle = "") => comprobaciones.push({ nombre, ok, detalle });

  anadir("DOCTYPE html", /^<!DOCTYPE html>/i.test(html.trim()));

  const lang = html.match(/<html[^>]*\slang\s*=\s*"([^"]*)"/i);
  anadir("html con lang", Boolean(lang && lang[1].trim()), lang ? "" : "falta <html lang=…>");

  anadir("meta charset", /<meta[^>]*charset\s*=/i.test(html));
  anadir("meta viewport", /<meta[^>]*name\s*=\s*"viewport"/i.test(html));

  const titulo = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  anadir("title no vacío", Boolean(titulo && titulo[1].trim()), titulo?.[1].trim() ? "" : "vacío o ausente");

  const niveles = [...html.matchAll(/<h([1-6])[^>]*>/gi)].map((m) => Number(m[1]));
  anadir("un solo h1", niveles.filter((n) => n === 1).length === 1, `hay ${niveles.filter((n) => n === 1).length}`);

  let salto = "";
  for (let i = 1; i < niveles.length && !salto; i++) {
    if (niveles[i] > niveles[i - 1] + 1) salto = `de h${niveles[i - 1]} a h${niveles[i]}`;
  }
  anadir("encabezados sin saltos", !salto, salto ? `salto ${salto}` : "");

  const imgs = [...html.matchAll(/<img[^>]*>/gi)];
  const sinAlt = imgs.filter((t) => !/\salt\s*=/i.test(t[0]));
  anadir("imágenes con alt", sinAlt.length === 0, sinAlt.length ? `${sinAlt.length} sin alt` : "");

  const faltan = ["header", "main", "footer"].filter((t) => !new RegExp(`<${t}[\\s>]`, "i").test(html));
  anadir("landmarks header/main/footer", faltan.length === 0, faltan.length ? `faltan: ${faltan.join(", ")}` : "");

  let cssOk = true;
  let cssDetalle = "";
  try {
    parsearCss(css);
  } catch (error) {
    cssOk = false;
    cssDetalle = error.message;
  }
  anadir("hoja de estilos válida", cssOk, cssDetalle);

  return comprobaciones;
}

// ---------------------------------------------------------------------------
// 4. Servidor estático y cliente (solo bucle 127.0.0.1)
// ---------------------------------------------------------------------------

const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
]);

function responder(respuesta, estado, tipo, cuerpo) {
  const texto = Buffer.from(cuerpo);
  respuesta.writeHead(estado, { "content-type": tipo, "content-length": texto.length });
  respuesta.end(texto);
}

function servirArchivo(archivo, peticion, respuesta) {
  const tipo = MIME.get(extname(archivo).toLowerCase()) ?? "application/octet-stream";
  const cuerpo = readFileSync(archivo);
  respuesta.writeHead(200, { "content-type": tipo, "content-length": cuerpo.length });
  respuesta.end(peticion.method === "HEAD" ? undefined : cuerpo);
}

/** Servidor GET/HEAD con MIME por extensión y bloqueo de rutas fuera de `raiz`. */
export function servidorEstatico(raizDirectorio) {
  const raiz = resolve(raizDirectorio);
  return createServer((peticion, respuesta) => {
    if (peticion.method !== "GET" && peticion.method !== "HEAD") {
      respuesta.writeHead(405, { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" });
      respuesta.end("405: método no permitido");
      return;
    }

    let ruta;
    try {
      ruta = decodeURIComponent((peticion.url ?? "/").split("?")[0]);
    } catch {
      responder(respuesta, 400, "text/plain; charset=utf-8", "400: ruta ilegible");
      return;
    }

    const destino = resolve(raiz, `.${ruta}`);
    if (destino !== raiz && !destino.startsWith(raiz + sep)) {
      responder(respuesta, 403, "text/plain; charset=utf-8", "403: ruta fuera del directorio");
      return;
    }

    let archivo = destino;
    let estat = statSync(destino, { throwIfNoEntry: false });
    if (estat?.isDirectory()) {
      archivo = join(destino, "index.html");
      estat = statSync(archivo, { throwIfNoEntry: false });
    }
    if (!estat?.isFile()) {
      responder(respuesta, 404, "text/plain; charset=utf-8", "404: no existe");
      return;
    }
    servirArchivo(archivo, peticion, respuesta);
  });
}

/** GET sencillo contra 127.0.0.1; devuelve { estado, cabeceras, cuerpo }. */
export function pedir(puerto, ruta, metodo = "GET") {
  return new Promise((resolver, rechazar) => {
    const peticion = request(
      { host: "127.0.0.1", port: puerto, path: ruta, method: metodo },
      (respuesta) => {
        const trozos = [];
        respuesta.on("data", (trozo) => trozos.push(trozo));
        respuesta.on("end", () =>
          resolver({
            estado: respuesta.statusCode,
            cabeceras: respuesta.headers,
            cuerpo: Buffer.concat(trozos).toString("utf8"),
          }),
        );
      },
    );
    peticion.on("error", rechazar);
    peticion.end();
  });
}

/** Escucha en un puerto efímero de 127.0.0.1 y devuelve el puerto. */
export function arrancar(servidor) {
  return new Promise((resolver, rechazar) => {
    servidor.once("error", rechazar);
    servidor.listen(0, "127.0.0.1", () => resolver(servidor.address().port));
  });
}

/** Para con cierre limpio. */
export function detener(servidor) {
  return new Promise((resolver) => servidor.close(resolver));
}
