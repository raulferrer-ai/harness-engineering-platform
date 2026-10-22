// especificidad.js — l03: la tabla de especificidad y quién gana en la cascada.
import { readFileSync } from "node:fs";
import { parsearHtml, parsearCss, estilosCalculados } from "./web.js";

const html = readFileSync(new URL("./pagina/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("./pagina/estilos.css", import.meta.url), "utf8");

const reglas = parsearCss(css);
console.log("reglas y especificidad (ids, clases, elementos):");
for (const regla of reglas) {
  const [a, b, c] = regla.especificidad;
  console.log(`  ${String(regla.orden + 1).padStart(2)}. ${regla.selector.padEnd(14)} → (${a}, ${b}, ${c})`);
}

const calculados = estilosCalculados(parsearHtml(html), reglas);
const donde = (elemento, propiedad) => {
  const fila = calculados.find((f) => f.elemento === elemento);
  return { valor: fila.estilos[propiedad], fuente: fila.fuentes[propiedad] };
};

const destacado = calculados.find((f) => f.elemento.atributos.class === "destacado").elemento;
const enlaceNav = calculados.find(
  (f) => f.elemento.etiqueta === "a" && f.camino.some((a) => a.etiqueta === "nav"),
).elemento;
const pie = calculados.find((f) => f.camino.some((a) => a.atributos?.id === "pie") && f.elemento.etiqueta === "p").elemento;

const colorDestacado = donde(destacado, "color");
console.log(`\ncolor de p.destacado → ${colorDestacado.valor} ← ${colorDestacado.fuente}`);
console.log("  gana .destacado (0,1,0) sobre p (0,0,1): la clase pesa más que la etiqueta");

const colorNav = donde(enlaceNav, "color");
console.log(`color de nav a → ${colorNav.valor} ← ${colorNav.fuente}`);
console.log("  empate exacto entre las dos reglas nav a (0,0,2): gana la última, que es la posterior");

const sizePie = donde(pie, "font-size");
console.log(`font-size del p del pie → ${sizePie.valor} ← ${sizePie.fuente}`);
console.log("  gana #pie p (1,0,1) sobre p (0,0,1): un id decide la cascada");
