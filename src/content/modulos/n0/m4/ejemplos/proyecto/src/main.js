// src/main.js — módulo 3 del proyecto: punto de entrada (lección l07)
import { leerGastos } from "./gastos.js";
import { generarInforme } from "./informe.js";

const USO = "Uso: node src/main.js <ruta-del-csv>";

const ruta = process.argv[2];
if (!ruta) {
  console.error(`falta la ruta del fichero.\n${USO}`);
  process.exit(1);
}

try {
  console.log(generarInforme(leerGastos(ruta)));
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exit(1);
}
