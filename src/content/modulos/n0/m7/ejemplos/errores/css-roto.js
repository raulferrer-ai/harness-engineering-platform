// errores/css-roto.js — rojo de l03: una declaración sin «:» detiene el
// análisis de la hoja de estilos. El Error con su línea termina en stderr
// y el proceso sale con código 1.
import { parsearCss } from "../web.js";

const cssRoto = `
p.roto {
  color red;
}
`;

parsearCss(cssRoto);
console.log("no debería llegar aquí: el CSS roto se analiza sin más");
