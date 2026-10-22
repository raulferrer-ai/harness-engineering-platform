// api-aprobada.js — rojo de l02: la API aprobada sin verificar (TypeError).
// El asistente propuso fs.readFileAsync y el código la invoca directamente:
// nadie comprobó que el símbolo existiera, así que el runtime tropieza con
// ella en caliente. La lección: verificar el símbolo antes de confiar.
import * as fs from "node:fs";

const texto = await fs.readFileAsync("datos.txt", "utf8");
console.log(`leído: ${texto}`);
