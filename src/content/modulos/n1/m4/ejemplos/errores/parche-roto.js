// H16 (l03) — el parche de edición inline que se olvida de la frontera vacía.
// La suite lo desmonta antes de que llegue a Keep.
import { pathToFileURL } from "node:url";

import { aplicarYVerificar, PARCHE_ROTO } from "../edicion-inline.js";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const resultado = aplicarYVerificar(PARCHE_ROTO);
  console.log(`suite con el parche propuesto: pass ${resultado.pass} · fail ${resultado.fail}`);
  if (resultado.status === 0) {
    console.log("parche en verde: se podría aplicar (Keep)");
  } else {
    console.error("✗ parche en rojo: no se aplica (Undo) — la suite, no el aspecto, manda");
    process.exit(1);
  }
}
