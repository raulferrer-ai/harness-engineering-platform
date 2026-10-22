// arbol-dom.js — l02: la página convertida en árbol y mostrada en consola.
import { readFileSync } from "node:fs";
import { parsearHtml, lineasDelArbol } from "./web.js";

const html = readFileSync(new URL("./pagina/index.html", import.meta.url), "utf8");
const arbol = parsearHtml(html);

for (const linea of lineasDelArbol(arbol)) console.log(linea);

const cuentas = { elementos: 0, texto: 0 };
const contar = (nodo) => {
  if (nodo.tipo === "elemento") cuentas.elementos += 1;
  if (nodo.tipo === "texto") cuentas.texto += 1;
  for (const hijo of nodo.hijos ?? []) contar(hijo);
};
contar(arbol);
console.log(`árbol construido: ${cuentas.elementos} elementos y ${cuentas.texto} nodos de texto`);
