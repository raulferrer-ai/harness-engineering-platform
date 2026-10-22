// errores/ruta-404.js — rojo de l04: pedimos una página que no existe
// esperando 200 y el servidor responde 404. La comprobación en rojo sale
// con código 1.
import { fileURLToPath } from "node:url";
import { servidorEstatico, arrancar, detener, pedir } from "../web.js";

const pagina = fileURLToPath(new URL("../pagina", import.meta.url));
const servidor = servidorEstatico(pagina);
const puerto = await arrancar(servidor);

try {
  const ruta = "/pagina-que-no-existe.html";
  const respuesta = await pedir(puerto, ruta);
  console.log(`GET ${ruta} → ${respuesta.estado}`);
  if (respuesta.estado !== 200) {
    console.error(`comprobación en rojo: esperado 200, recibido ${respuesta.estado}`);
    process.exitCode = 1;
  }
} finally {
  await detener(servidor);
}
