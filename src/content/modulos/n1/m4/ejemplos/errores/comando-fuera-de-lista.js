// H16 (l04) — el asistente de terminal propone publicar sin revisión.
// La lista permitida no lo contempla: ni se ejecuta, ni se negocia.
import { pathToFileURL } from "node:url";

import { permitido } from "../comandos-permitidos.js";

const COMANDO = "git push --force origin main";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`propuesta del asistente de terminal: ${COMANDO}`);
  if (permitido(COMANDO)) {
    console.error(`permitido inesperadamente: «${COMANDO}»; revisa tu lista permitida`);
    process.exit(0);
  }
  console.error(
    `✗ comando rechazado: «${COMANDO}» no está en la lista permitida; el asistente no publica sin tu lista`,
  );
  process.exit(1);
}
