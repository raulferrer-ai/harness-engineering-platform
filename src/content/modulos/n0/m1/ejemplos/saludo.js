// saludo.js — imprime un saludo y el ciclo de esta lección
const nombre = "mundo";
const pasos = ["escribir", "ejecutar", "comprobar"];

function contarPasos(lista) {
  return lista.map((p, i) => `${i + 1}. ${p}`).join("\n");
}

console.log(`Hola, ${nombre}`);
console.log(contarPasos(pasos));
