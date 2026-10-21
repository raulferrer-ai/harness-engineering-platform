// import-inesistente.js — importar un módulo que no existe (lección l01)
// Node detiene el programa en la carga: el import es lo primero que se resuelve.
import { nada } from "./no-existe.js";

console.log(nada);
