// variables.js — ámbito de bloque y por qué const es el valor por defecto (lección l02)
const nombre = "Ada";

if (typeof nombre === "string") {
  // Sombra: dentro del bloque existe OTRA variable llamada nombre.
  const nombre = "Grace";
  console.log("dentro del bloque:", nombre);
}

console.log("fuera del bloque:", nombre);

let contador = 0;
contador = contador + 1; // let sí admite reasignación
console.log("contador:", contador);
