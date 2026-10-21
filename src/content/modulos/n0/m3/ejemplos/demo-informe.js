// demo-informe.js — el script del entregable: procesa el fichero real e imprime el informe (lección l07)
import { fileURLToPath } from "node:url";

import { generarInforme } from "./informe.js";

const ruta = fileURLToPath(new URL("./datos/gastos.csv", import.meta.url));
console.log(generarInforme(ruta));
