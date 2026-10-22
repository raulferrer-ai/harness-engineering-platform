// servidor-estatico.js — l05: rutas, MIME y protección de directorio.
import { fileURLToPath } from "node:url";
import { servidorEstatico, arrancar, detener, pedir } from "./web.js";

const pagina = fileURLToPath(new URL("./pagina", import.meta.url));
const servidor = servidorEstatico(pagina);
const puerto = await arrancar(servidor);

const casos = [
  { ruta: "/", esperado: 200, tipo: "text/html; charset=utf-8" },
  { ruta: "/estilos.css", esperado: 200, tipo: "text/css; charset=utf-8" },
  { ruta: "/diagrama.svg", esperado: 200, tipo: "image/svg+xml" },
  { ruta: "/no-existe", esperado: 404, tipo: "text/plain; charset=utf-8" },
  { ruta: "/%2e%2e/secreto.txt", esperado: 403, tipo: "text/plain; charset=utf-8" },
];

let fallidas = 0;
try {
  for (const caso of casos) {
    const respuesta = await pedir(puerto, caso.ruta);
    const ok = respuesta.estado === caso.esperado && respuesta.cabeceras["content-type"] === caso.tipo;
    if (!ok) fallidas += 1;
    console.log(
      `${ok ? "✓" : "✗"} ${caso.ruta} → ${respuesta.estado} · ${respuesta.cabeceras["content-type"]}${
        ok ? "" : ` (esperado ${caso.esperado} · ${caso.tipo})`
      }`,
    );
  }
} finally {
  await detener(servidor);
}

console.log(
  fallidas === 0
    ? "5 rutas comprobadas en verde: archivos, 404 y ruta fuera del directorio"
    : `${fallidas} ruta(s) en rojo de 5`,
);
process.exit(fallidas === 0 ? 0 : 1);
