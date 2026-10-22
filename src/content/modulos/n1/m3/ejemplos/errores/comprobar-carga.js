// H15 — el revisor intenta cargar la entrega rota y se la devuelve sin más vueltas.
import { cargarModulo } from "../diff.js";

const carga = await cargarModulo(new URL("./despues-roto.js", import.meta.url).href);
if (carga.ok) {
  console.log("la entrega carga correctamente");
} else {
  console.error(`entrega que no carga: ${carga.error.name}: ${carga.error.message}`);
  process.exit(1);
}
