// pagina.test.js — l07: la suite del entregable. Diez pruebas node:test:
// estructura y semántica, cascada y las tres respuestas del servidor.
// La variable de entorno PAGINA permite apuntar la suite a otra página
// (es lo que usa entregable-pagina.js para la fase roja) sin editarla.
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  parsearHtml,
  parsearCss,
  estilosCalculados,
  validarPagina,
  servidorEstatico,
  arrancar,
  detener,
  pedir,
} from "./web.js";

const rutaPagina = process.env.PAGINA ?? fileURLToPath(new URL("./pagina/index.html", import.meta.url));
const html = readFileSync(rutaPagina, "utf8");
const css = readFileSync(fileURLToPath(new URL("./pagina/estilos.css", import.meta.url)), "utf8");

const comprobaciones = new Map(validarPagina(html, css).map((c) => [c.nombre, c]));
const exigir = (nombre) => {
  const comprobacion = comprobaciones.get(nombre);
  assert.ok(comprobacion, `comprobación ausente: ${nombre}`);
  assert.equal(comprobacion.ok, true, comprobacion.detalle || nombre);
};

let servidor;
let puerto;

before(async () => {
  servidor = servidorEstatico(fileURLToPath(new URL("./pagina", import.meta.url)));
  puerto = await arrancar(servidor);
});

after(async () => {
  await detener(servidor);
});

describe("estructura de la página", () => {
  it("doctype, lang, charset, viewport y título correctos", () => {
    exigir("DOCTYPE html");
    exigir("html con lang");
    exigir("meta charset");
    exigir("meta viewport");
    exigir("title no vacío");
  });

  it("exactamente un h1", () => exigir("un solo h1"));

  it("jerarquía de encabezados sin saltos", () => exigir("encabezados sin saltos"));

  it("toda imagen tiene alt", () => exigir("imágenes con alt"));

  it("landmarks: header, main y footer", () => exigir("landmarks header/main/footer"));
});

describe("estilos", () => {
  it("la hoja de estilos se analiza sin errores", () => {
    assert.doesNotThrow(() => parsearCss(css), "la sintaxis CSS debería ser válida");
  });

  it("la cascada da el color de p.destacado a .destacado, no a p", () => {
    const calculados = estilosCalculados(parsearHtml(html), parsearCss(css));
    const destacado = calculados.find((f) => f.elemento.atributos.class === "destacado");
    assert.ok(destacado, "la página debería tener un p.destacado");
    assert.equal(destacado.estilos.color, "#b3261e", "gana .destacado por especificidad");
    assert.equal(destacado.estilos["font-weight"], "600", "la regla compuesta también aplica");
  });
});

describe("el servidor responde", () => {
  it("GET / → 200 con text/html", async () => {
    const respuesta = await pedir(puerto, "/");
    assert.equal(respuesta.estado, 200);
    assert.equal(respuesta.cabeceras["content-type"], "text/html; charset=utf-8");
  });

  it("GET /no-existe → 404", async () => {
    const respuesta = await pedir(puerto, "/no-existe");
    assert.equal(respuesta.estado, 404, "lo que no existe responde 404");
  });

  it("GET /%2e%2e/secreto.txt → 403, la ruta de escape queda fuera", async () => {
    const respuesta = await pedir(puerto, "/%2e%2e/secreto.txt");
    assert.equal(respuesta.estado, 403, "nada fuera del directorio publicado");
  });
});
