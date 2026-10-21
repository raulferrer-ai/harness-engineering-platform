// usar-convertir.js — demo que importa el módulo convertir.js (lección l01)
import { EUR, importeEnEuros } from "./convertir.js";

console.log(`Usando el módulo convertir.js (moneda: ${EUR})`);

const gastos = [
  { descripcion: "pan", importe: 1.85 },
  { descripcion: "cine", importe: 9.0 },
];

for (const gasto of gastos) {
  console.log(`${gasto.descripcion}: ${importeEnEuros(gasto.importe)}`);
}
