// fuera-de-rango.js — acceder fuera de la lista devuelve undefined y revienta después (lección l03)
const gastos = [{ descripcion: "café", importe: 2.5 }];
const inexistente = gastos[7];
console.log(inexistente.importe);
