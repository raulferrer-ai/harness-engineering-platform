// ruta-critica.js — l06: DOM + hoja de estilos → estilos finales por elemento.
import { readFileSync } from "node:fs";
import { parsearHtml, parsearCss, estilosCalculados } from "./web.js";

const html = readFileSync(new URL("./pagina/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("./pagina/estilos.css", import.meta.url), "utf8");

const calculados = estilosCalculados(parsearHtml(html), parsearCss(css));

const nombreDe = (elemento) => {
  const id = elemento.atributos.id ? `#${elemento.atributos.id}` : "";
  const clases = elemento.atributos.class
    ? `.${elemento.atributos.class.split(/\s+/).join(".")}`
    : "";
  return `${elemento.etiqueta}${id}${clases}`;
};

let conAutor = 0;
let soloAgente = 0;
for (const { elemento, estilos, fuentes } of calculados) {
  const propiedadesDeAutor = Object.keys(estilos).filter(
    (propiedad) => fuentes[propiedad] !== "hoja del agente (usuario)",
  );
  if (propiedadesDeAutor.length === 0) {
    soloAgente += 1;
    continue;
  }
  conAutor += 1;
  const partes = Object.keys(estilos).map((propiedad) => {
    const deAutor = fuentes[propiedad] !== "hoja del agente (usuario)";
    return deAutor
      ? `${propiedad}: ${estilos[propiedad]} ← ${fuentes[propiedad]}`
      : `${propiedad}: ${estilos[propiedad]} ← hoja del agente`;
  });
  console.log(`${nombreDe(elemento).padEnd(22)} ${partes.join(" · ")}`);
}

console.log(
  `\n${conAutor} elementos con reglas de autor y ${soloAgente} solo con la hoja del agente: la cascada ha resuelto todo el documento`,
);
