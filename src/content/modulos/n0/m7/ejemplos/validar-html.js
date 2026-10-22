// validar-html.js — l01: las diez comprobaciones estructurales de la página.
import { readFileSync } from "node:fs";
import { validarPagina } from "./web.js";

const html = readFileSync(new URL("./pagina/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("./pagina/estilos.css", import.meta.url), "utf8");

const comprobaciones = validarPagina(html, css);
let fallidas = 0;
for (const comprobacion of comprobaciones) {
  const sello = comprobacion.ok ? "✓" : "✗";
  console.log(`${sello} ${comprobacion.nombre}${comprobacion.detalle ? ` — ${comprobacion.detalle}` : ""}`);
  if (!comprobacion.ok) fallidas += 1;
}

const pasan = comprobaciones.length - fallidas;
console.log(
  fallidas === 0
    ? `${pasan} comprobaciones en verde`
    : `${fallidas} comprobaciones en rojo; ${pasan} en verde`,
);
process.exit(fallidas === 0 ? 0 : 1);
