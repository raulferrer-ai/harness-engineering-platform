// errores/html-invalido.js — rojo de l01: así NO se marca una página.
// Seis de las diez comprobaciones caen; sale con código 1.
import { readFileSync } from "node:fs";
import { validarPagina } from "../web.js";

const css = readFileSync(new URL("../pagina/estilos.css", import.meta.url), "utf8");

const htmlRoto = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>   </title>
  </head>
  <body>
    <h1>Página sin estructura</h1>
    <h3>Salto directo de h1 a h3</h3>
    <img src="foto.png">
    <p>Falta lang, viewport, título, alt y los landmarks.</p>
  </body>
</html>`;

const comprobaciones = validarPagina(htmlRoto, css);
let fallidas = 0;
for (const comprobacion of comprobaciones) {
  const sello = comprobacion.ok ? "✓" : "✗";
  console.log(`${sello} ${comprobacion.nombre}${comprobacion.detalle ? ` — ${comprobacion.detalle}` : ""}`);
  if (!comprobacion.ok) fallidas += 1;
}

const pasan = comprobaciones.length - fallidas;
console.log(`${fallidas} comprobaciones en rojo; ${pasan} en verde`);
process.exit(1);
