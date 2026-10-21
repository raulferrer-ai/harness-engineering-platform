// tipos.js — mapa de tipos primitivos y dos trampas de typeof (lección l01)
const texto = "mundo";
const numero = 42;
const decimal = 3.14;
const booleano = true;
const indefinido = undefined;
const nada = null;
const objeto = { clave: "valor" };

console.log(typeof texto, typeof numero, typeof decimal, typeof booleano);
console.log("typeof undefined =", typeof indefinido);
console.log("typeof null =", typeof nada, "(trampa conocida: null se reporta como objeto)");
console.log("typeof objeto =", typeof objeto);
console.log('"5" === 5 es', "5" === 5, 'pero "5" == 5 es', "5" == 5);
