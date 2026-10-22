// contexto-inflado.js — mandar todo el contexto «por si acaso» (l02, rojo)
// Termina en rojo a propósito: el comprobador rechaza las piezas innecesarias
// que se incluyen solo por precaución. El ruido no es gratis: compite con la
// instrucción por la atención del modelo (m1/l04) y por la ventana (m1/l03).
// Uso: node contexto-inflado.js (devuelve código 1).

import { contarPalabras, seleccionar } from "../contexto-minimo.js";

const piezas = [
  {
    pieza: "fragmento: export function normalizarNombre(texto) { return texto.trim(); }",
    necesaria: true,
  },
  {
    pieza: "convención del proyecto: módulos ESM y funciones puras",
    necesaria: true,
  },
  {
    pieza: "comando de verificación: node --test normalizar-nombre.test.js",
    necesaria: true,
  },
  {
    pieza: "historia: el módulo nació en 2024 para ventas y hoy lo usa operaciones",
    necesaria: false,
  },
  {
    pieza: "archivo completo de 300 líneas del que se extrajo el fragmento",
    necesaria: false,
  },
];

// El error humano típico: incluirlo todo «por si acaso».
const incluidas = piezas;
const innecesarias = incluidas.filter((p) => !p.necesaria);
const palabras = contarPalabras(incluidas.map((p) => p.pieza).join(" "));

console.log(`piezas incluidas: ${incluidas.length} de ${incluidas.length}`);
console.log(`palabras del contexto: ${palabras}`);
console.log(`necesarias de verdad: ${seleccionar(piezas).length}`);

if (innecesarias.length > 0) {
  for (const p of innecesarias) {
    console.error(`✗ pieza innecesaria: ${p.pieza}`);
  }
  console.error(
    `contexto refutado: ${innecesarias.length} piezas no son necesarias para esta tarea`,
  );
  process.exit(1);
}

console.log("contexto mínimo confirmado.");
