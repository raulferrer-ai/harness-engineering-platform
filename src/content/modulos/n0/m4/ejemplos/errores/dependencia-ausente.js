// dependencia-ausente.js — importar un paquete que no está instalado (l04)
// No hace falta instalar nada: el import falla en la carga porque el paquete
// no está en node_modules (ni en este proyecto ni en los padres de la carpeta).
import { leftTrim } from "left-pad";

console.log(leftTrim("x"));
