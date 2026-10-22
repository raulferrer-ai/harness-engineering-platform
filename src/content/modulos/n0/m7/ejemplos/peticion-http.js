// peticion-http.js — l04: anatomía de una petición y de su respuesta.
import { fileURLToPath } from "node:url";
import { servidorEstatico, arrancar, detener, pedir } from "./web.js";

const pagina = fileURLToPath(new URL("./pagina", import.meta.url));
const servidor = servidorEstatico(pagina);
const puerto = await arrancar(servidor);

try {
  const principal = await pedir(puerto, "/");
  console.log(
    `GET / → ${principal.estado} · content-type: ${principal.cabeceras["content-type"]} · content-length: ${principal.cabeceras["content-length"]}`,
  );

  const inexistente = await pedir(puerto, "/no-existe");
  console.log(
    `GET /no-existe → ${inexistente.estado} · content-type: ${inexistente.cabeceras["content-type"]} · cuerpo: ${inexistente.cuerpo}`,
  );

  const ok =
    principal.estado === 200 &&
    principal.cabeceras["content-type"] === "text/html; charset=utf-8" &&
    Number(principal.cabeceras["content-length"]) === Buffer.byteLength(principal.cuerpo) &&
    inexistente.estado === 404;
  console.log(ok ? "2 comprobaciones HTTP en verde" : "comprobaciones HTTP en rojo");
  process.exitCode = ok ? 0 : 1;
} finally {
  await detener(servidor);
}
